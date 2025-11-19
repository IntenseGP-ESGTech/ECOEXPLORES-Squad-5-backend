import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { OAuth2Client } from 'google-auth-library';
import { pool, ensureDatabase } from './db.js';
import { toPublicUser } from './utils/storage.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '947552891912-hh18hrfr7fne8t6sq8g5gf8abhshj0gp.apps.googleusercontent.com';
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

function mapDbUser(row) {
  if (!row) return null;
  const serializeDate = value => (value instanceof Date ? value.toISOString() : value);
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    provider: row.provider || 'local',
    providerId: row.provider_id,
    createdAt: serializeDate(row.created_at),
    updatedAt: serializeDate(row.updated_at),
  };
}

async function findUserByEmail(email) {
  const { rows } = await pool.query(
    `
      SELECT id, name, email, password_hash, provider, provider_id, created_at, updated_at
      FROM users
      WHERE email = $1
      LIMIT 1
    `,
    [String(email).toLowerCase()],
  );
  return mapDbUser(rows[0]);
}

async function findUserById(id) {
  const { rows } = await pool.query(
    `
      SELECT id, name, email, password_hash, provider, provider_id, created_at, updated_at
      FROM users
      WHERE id = $1
      LIMIT 1
    `,
    [id],
  );
  return mapDbUser(rows[0]);
}

async function findUserByProviderId(provider, providerId) {
  const { rows } = await pool.query(
    `
      SELECT id, name, email, password_hash, provider, provider_id, created_at, updated_at
      FROM users
      WHERE provider = $1 AND provider_id = $2
      LIMIT 1
    `,
    [provider, providerId],
  );
  return mapDbUser(rows[0]);
}

async function createUser({ id, name, email, passwordHash = null, provider = 'local', providerId = null }) {
  const now = new Date().toISOString();
  const { rows } = await pool.query(
    `
      INSERT INTO users (id, name, email, password_hash, provider, provider_id, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $7)
      RETURNING id, name, email, password_hash, provider, provider_id, created_at, updated_at
    `,
    [id, name, email, passwordHash, provider, providerId, now],
  );
  return mapDbUser(rows[0]);
}

async function ensureAppReady() {
  await ensureDatabase();
}

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ECOEXPLORES Auth API',
      version: '1.0.0',
      description: 'API de autenticação com armazenamento JSON para a plataforma ECOEXPLORES',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      responses: {
        UnauthorizedError: {
          description: "Token inválido ou ausente",
          content: {
            "application/json": {
              example: { error: "Invalid token" },
            },
          },
        },
      },
    },
  },
  apis: ['./server/index.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is running
 *         content:
 *           application/json:
 *             example:
 *               ok: true
 *               service: auth
 *               time: "2024-01-15T10:30:00.000Z"
 */
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'auth', time: new Date().toISOString() });
});

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar novo usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: João Silva
 *               email:
 *                 type: string
 *                 example: joao@example.com
 *               password:
 *                 type: string
 *                 example: senha123
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Campos obrigatórios faltando
 *       409:
 *         description: Email já cadastrado
 */
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
  }

  const existing = await findUserByEmail(email);
  if (existing) {
    return res.status(409).json({ error: 'Email já cadastrado' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = await createUser({
    id: randomUUID(),
    name,
    email: email.toLowerCase(),
    passwordHash,
  });

  const token = jwt.sign({ sub: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({ user: toPublicUser(newUser), token });
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Fazer login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: joao@example.com
 *               password:
 *                 type: string
 *                 example: senha123
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *       400:
 *         description: Campos obrigatórios faltando
 *       401:
 *         description: Credenciais inválidas
 */
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  const user = await findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: 'Email ou senha inválidos' });
  }

  if (user.provider !== 'local') {
    return res.status(400).json({ error: 'Faça login com o Google para essa conta' });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ error: 'Email ou senha inválidos' });
  }

  const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ user: toPublicUser(user), token });
});

/**
 * @swagger
 * /api/auth/google:
 *   post:
 *     summary: Fazer login com Google
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - credential
 *             properties:
 *               credential:
 *                 type: string
 *                 description: Token JWT retornado pelo Google Identity Services
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *       400:
 *         description: Token ausente ou email não verificado
 *       401:
 *         description: Token inválido
 *       409:
 *         description: Email já utilizado por outro método
 */
app.post('/api/auth/google', async (req, res) => {
  const { credential } = req.body || {};
  if (!credential) {
    return res.status(400).json({ error: 'Token do Google é obrigatório' });
  }

  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });
    payload = ticket.getPayload();
  } catch (error) {
    return res.status(401).json({ error: 'Token do Google inválido', details: error.message });
  }

  const { sub, email, name, email_verified: emailVerified } = payload || {};
  if (!sub || !email) {
    return res.status(400).json({ error: 'Conta Google sem email válido' });
  }
  if (emailVerified === false) {
    return res.status(400).json({ error: 'Email do Google não verificado' });
  }

  const normalizedEmail = email.toLowerCase();
  let user = await findUserByProviderId('google', sub);

  if (!user) {
    const existing = await findUserByEmail(normalizedEmail);
    if (existing && existing.provider !== 'google') {
      return res.status(409).json({ error: 'Email já cadastrado. Use login com email/senha.' });
    }

    if (existing && existing.provider === 'google') {
      user = existing;
    } else {
      user = await createUser({
        id: randomUUID(),
        name: name || normalizedEmail.split('@')[0],
        email: normalizedEmail,
        provider: 'google',
        providerId: sub,
      });
    }
  }

  const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ user: toPublicUser(user), token });
});

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.sub;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Obter perfil do usuário autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do usuário
 *       401:
 *         description: Token inválido ou ausente
 *       404:
 *         description: Usuário não encontrado
 */
app.get('/api/auth/me', authMiddleware, async (req, res) => {
  const user = await findUserById(req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user: toPublicUser(user) });
});

ensureAppReady()
  .then(() => {
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`\n✅ Auth server running on http://localhost:${PORT}`);
      console.log(`📚 Swagger UI available at http://localhost:${PORT}/api-docs\n`);
    });
  })
  .catch(error => {
    // eslint-disable-next-line no-console
    console.error('❌ Failed to initialize application', error);
    process.exit(1);
  });


