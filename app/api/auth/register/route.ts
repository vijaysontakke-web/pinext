import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getUsers, saveUsers } from '../../../../lib/serverDb';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password, email, mobile, gender } = body;
    if (!username || !password) {
      return NextResponse.json({ error: 'Missing username or password' }, { status: 400 });
    }

    // Check password against Pwned Passwords API
    const sha1 = crypto.createHash('sha1').update(password).digest('hex').toUpperCase();
    const prefix = sha1.slice(0, 5);
    const suffix = sha1.slice(5);
    const resp = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    if (!resp.ok) {
      return NextResponse.json({ error: 'Could not check password breach status' }, { status: 502 });
    }
    const text = await resp.text();
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    let foundCount = 0;
    for (const line of lines) {
      const [hashPart, countPart] = line.split(':');
      if (!hashPart) continue;
      if (hashPart.toUpperCase() === suffix.toUpperCase()) {
        foundCount = Number(countPart || 0);
        break;
      }
    }
    if (foundCount > 0) {
      return NextResponse.json({ error: `This password has appeared in ${foundCount} breach(es). Please choose a different password.` }, { status: 400 });
    }

    const users = await getUsers();
    if (users[username]) {
      return NextResponse.json({ error: 'Username already exists' }, { status: 409 });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    users[username] = { password: hash, email, mobile, gender, createdAt: new Date().toISOString() };
    await saveUsers(users);

    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '7d' });
    return NextResponse.json({ token, username });
  } catch {
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
