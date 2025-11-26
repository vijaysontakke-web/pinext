import { promises as fs } from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const usersFile = path.join(dataDir, 'users.json');
const todosFile = path.join(dataDir, 'todos.json');

async function readJson(filePath: string) {
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw || '{}');
  } catch (e: any) {
    console.log(e.message)
    return {};
  }
}

async function writeJson(filePath: string, data: any) {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function getUsers() {
  return readJson(usersFile);
}

export async function saveUsers(users: any) {
  await writeJson(usersFile, users);
}

export async function getTodos() {
  return readJson(todosFile);
}

export async function saveTodos(todos: any) {
  await writeJson(todosFile, todos);
}
