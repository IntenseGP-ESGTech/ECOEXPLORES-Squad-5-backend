import dotenv from 'dotenv';
import { randomUUID } from 'crypto';
import { pool, ensureDatabase } from '../db.js';
import { ensureDataDirExists, readUsers } from '../utils/storage.js';

dotenv.config();

async function upsertUser(user) {
  const email = String(user.email).toLowerCase();
  const id = user.id || randomUUID();
  const createdAt = user.createdAt || new Date().toISOString();
  const updatedAt = user.updatedAt || createdAt;
  const provider = user.provider || 'local';
  const providerId = user.providerId || null;

  await pool.query(
    `
      INSERT INTO users (id, name, email, password_hash, provider, provider_id, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (email)
      DO UPDATE SET
        name = EXCLUDED.name,
        password_hash = EXCLUDED.password_hash,
        provider = EXCLUDED.provider,
        provider_id = EXCLUDED.provider_id,
        updated_at = EXCLUDED.updated_at
    `,
    [id, user.name, email, user.passwordHash, provider, providerId, createdAt, updatedAt],
  );
}

async function run() {
  await ensureDatabase();
  ensureDataDirExists();
  const users = await readUsers();
  if (!users.length) {
    // eslint-disable-next-line no-console
    console.log('Nenhum usuário encontrado no JSON para migrar.');
    return;
  }

  for (const user of users) {
    await upsertUser(user);
  }

  // eslint-disable-next-line no-console
  console.log(`✅ Migração concluída. ${users.length} registros processados.`);
}

run()
  .catch(error => {
    // eslint-disable-next-line no-console
    console.error('❌ Erro ao migrar usuários', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });


