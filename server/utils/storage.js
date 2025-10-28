import fs from 'fs-extra';
import path from 'path';

const dataDir = path.join(process.cwd(), 'server', 'storage');
const usersFile = path.join(dataDir, 'users.json');

export function ensureDataDirExists() {
  fs.ensureDirSync(dataDir);
  if (!fs.existsSync(usersFile)) {
    fs.writeJsonSync(usersFile, []);
  }
}

export async function readUsers() {
  try {
    const users = await fs.readJson(usersFile);
    return Array.isArray(users) ? users : [];
  } catch {
    return [];
  }
}

export async function writeUsers(users) {
  await fs.writeJson(usersFile, users, { spaces: 2 });
}

export async function findUserByEmail(email) {
  const users = await readUsers();
  return users.find(u => u.email === String(email).toLowerCase());
}

export function toPublicUser(user) {
  if (!user) return null;
  const { passwordHash, ...rest } = user;
  return rest;
}


