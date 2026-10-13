import { NextRequest, NextResponse } from 'next/server';
import { getDb, initNeonTables } from '@/lib/neon';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { email, name, role = 'STUDENT', password, identifier, phone } = data;

    if (!email || !name) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
    }

    const userId = `usr_${Date.now()}`;
    const user = {
      id: userId,
      email: email.trim().toLowerCase(),
      name: name.trim(),
      role: role.toUpperCase(),
      phone: phone || null,
      identifier: identifier || email.trim().toLowerCase(),
    };

    const sql = await getDb();
    if (sql) {
      await initNeonTables();
      await sql`
        INSERT INTO users (id, email, name, role, phone, identifier, password_hash)
        VALUES (${user.id}, ${user.email}, ${user.name}, ${user.role}, ${user.phone}, ${user.identifier}, ${password || 'secret'})
        ON CONFLICT (email) DO UPDATE SET name = ${user.name}, role = ${user.role}
      `;
    }

    const response = NextResponse.json({
      success: true,
      message: 'Account registered successfully with NeonAuth.',
      user
    });

    const cookieValue = Buffer.from(JSON.stringify(user)).toString('base64');
    response.cookies.set('gkac_session', cookieValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Registration failed' }, { status: 500 });
  }
}
