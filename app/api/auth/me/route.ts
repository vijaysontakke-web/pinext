import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getUsers } from '../../../../lib/serverDb';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export async function GET(req: Request) {
  try {
    const auth = req.headers.get('authorization') || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return NextResponse.json({ user: null });
    const payload: any = jwt.verify(token, JWT_SECRET);
    const users = await getUsers();
    const user = users[payload.username];
    if (!user) return NextResponse.json({ user: null });
    const { password, ...rest } = user;
    return NextResponse.json({ user: { username: payload.username, ...rest } });
  } catch (err: any) {
    console.log(err.message);
    return NextResponse.json({ user: null });
  }
}
