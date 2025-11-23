import dotenv from 'dotenv';
import pkg from 'pg';

dotenv.config();

const { Pool } = pkg;

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/ecoexplores';

export const pool = new Pool({
  connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export async function ensureDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT,
      provider TEXT NOT NULL DEFAULT 'local',
      provider_id TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await pool.query(`
    ALTER TABLE users
      ADD COLUMN IF NOT EXISTS provider TEXT NOT NULL DEFAULT 'local',
      ADD COLUMN IF NOT EXISTS provider_id TEXT
  `);

  await pool.query(`
    ALTER TABLE users
      ALTER COLUMN password_hash DROP NOT NULL
  `);

  await pool.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS users_provider_provider_id_idx
      ON users (provider, provider_id)
      WHERE provider_id IS NOT NULL
  `);

  // Tabela de Trilhas de Aprendizado
  await pool.query(`
    CREATE TABLE IF NOT EXISTS learning_paths (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      target_audience TEXT,
      status TEXT NOT NULL DEFAULT 'Rascunho' CHECK (status IN ('Rascunho', 'Publicada')),
      creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      content JSONB DEFAULT '[]'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS learning_paths_creator_id_idx ON learning_paths(creator_id)
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS learning_paths_status_idx ON learning_paths(status)
  `);
}


