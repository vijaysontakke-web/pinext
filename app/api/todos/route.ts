import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getTodos, saveTodos } from '../../../lib/serverDb';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

async function getUsernameFromReq(req: Request) {
  const auth = req.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return null;
  try {
    const payload: any = jwt.verify(token, JWT_SECRET);
    return payload.username;
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  const username = await getUsernameFromReq(req);
  if (!username) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const todos = await getTodos();
  return NextResponse.json({ todos: todos[username] || [] });
}

export async function POST(req: Request) {
  const username = await getUsernameFromReq(req);
  if (!username) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const { text } = body;
  if (!text) return NextResponse.json({ error: 'Missing text' }, { status: 400 });

  const todos = await getTodos();
  const item = { id: crypto.randomUUID(), text, completed: false };
  todos[username] = [item, ...(todos[username] || [])];
  await saveTodos(todos);
  return NextResponse.json({ todo: item });
}

export async function DELETE(req: Request) {
  const username = await getUsernameFromReq(req);
  if (!username) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const { id } = body;
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const todos = await getTodos();
  todos[username] = (todos[username] || []).filter((t: any) => t.id !== id);
  await saveTodos(todos);
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request) {
  const username = await getUsernameFromReq(req);
  if (!username) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const { id } = body;
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const todos = await getTodos();
  todos[username] = (todos[username] || []).map((t: any) => (t.id === id ? { ...t, completed: !t.completed } : t));
  await saveTodos(todos);
  return NextResponse.json({ ok: true });
}
