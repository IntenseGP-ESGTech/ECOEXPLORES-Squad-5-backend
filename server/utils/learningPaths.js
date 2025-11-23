import { pool } from '../db.js';

export function mapLearningPath(row) {
  if (!row) return null;
  const serializeDate = value => (value instanceof Date ? value.toISOString() : value);
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    description: row.description,
    targetAudience: row.target_audience,
    status: row.status,
    creatorId: row.creator_id,
    content: row.content || [],
    createdAt: serializeDate(row.created_at),
    updatedAt: serializeDate(row.updated_at),
  };
}

export async function getAllLearningPaths(filters = {}) {
  let query = `
    SELECT id, code, name, description, target_audience, status, creator_id, content, created_at, updated_at
    FROM learning_paths
    WHERE 1=1
  `;
  const params = [];
  let paramCount = 1;

  if (filters.status) {
    query += ` AND status = $${paramCount}`;
    params.push(filters.status);
    paramCount++;
  }

  if (filters.creatorId) {
    query += ` AND creator_id = $${paramCount}`;
    params.push(filters.creatorId);
    paramCount++;
  }

  if (filters.targetAudience) {
    query += ` AND target_audience = $${paramCount}`;
    params.push(filters.targetAudience);
    paramCount++;
  }

  query += ` ORDER BY created_at DESC`;

  const { rows } = await pool.query(query, params);
  return rows.map(mapLearningPath);
}

export async function getLearningPathById(id) {
  const { rows } = await pool.query(
    `
      SELECT id, code, name, description, target_audience, status, creator_id, content, created_at, updated_at
      FROM learning_paths
      WHERE id = $1
      LIMIT 1
    `,
    [id],
  );
  return mapLearningPath(rows[0]);
}

export async function getLearningPathByCode(code) {
  const { rows } = await pool.query(
    `
      SELECT id, code, name, description, target_audience, status, creator_id, content, created_at, updated_at
      FROM learning_paths
      WHERE code = $1
      LIMIT 1
    `,
    [code],
  );
  return mapLearningPath(rows[0]);
}

export async function createLearningPath({ code, name, description, targetAudience, status, creatorId, content }) {
  const now = new Date().toISOString();
  const { rows } = await pool.query(
    `
      INSERT INTO learning_paths (code, name, description, target_audience, status, creator_id, content, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $8)
      RETURNING id, code, name, description, target_audience, status, creator_id, content, created_at, updated_at
    `,
    [code, name, description || null, targetAudience || null, status || 'Rascunho', creatorId, JSON.stringify(content || []), now],
  );
  return mapLearningPath(rows[0]);
}

export async function updateLearningPath(id, { code, name, description, targetAudience, status, content }) {
  const now = new Date().toISOString();
  const updates = [];
  const params = [];
  let paramCount = 1;

  if (code !== undefined) {
    updates.push(`code = $${paramCount}`);
    params.push(code);
    paramCount++;
  }
  if (name !== undefined) {
    updates.push(`name = $${paramCount}`);
    params.push(name);
    paramCount++;
  }
  if (description !== undefined) {
    updates.push(`description = $${paramCount}`);
    params.push(description);
    paramCount++;
  }
  if (targetAudience !== undefined) {
    updates.push(`target_audience = $${paramCount}`);
    params.push(targetAudience);
    paramCount++;
  }
  if (status !== undefined) {
    updates.push(`status = $${paramCount}`);
    params.push(status);
    paramCount++;
  }
  if (content !== undefined) {
    updates.push(`content = $${paramCount}`);
    params.push(JSON.stringify(content));
    paramCount++;
  }

  if (updates.length === 0) {
    return getLearningPathById(id);
  }

  updates.push(`updated_at = $${paramCount}`);
  params.push(now);
  paramCount++;
  params.push(id);

  const { rows } = await pool.query(
    `
      UPDATE learning_paths
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, code, name, description, target_audience, status, creator_id, content, created_at, updated_at
    `,
    params,
  );
  return mapLearningPath(rows[0]);
}

export async function deleteLearningPath(id) {
  const { rows } = await pool.query(
    `
      DELETE FROM learning_paths
      WHERE id = $1
      RETURNING id
    `,
    [id],
  );
  return rows[0]?.id || null;
}

