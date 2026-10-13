import { NextRequest, NextResponse } from 'next/server';
import { getDb, initNeonTables } from '@/lib/neon';

export async function POST(req: NextRequest) {
  try {
    const { identifier, password } = await req.json();
    if (!identifier) {
      return NextResponse.json({ error: 'Please enter your email, admission number, or staff ID.' }, { status: 400 });
    }

    const cleanIdentifier = identifier.trim();

    // Check Neon database if configured
    const sql = await getDb();
    if (sql) {
      await initNeonTables();
      const users = await sql`
        SELECT id, email, name, role, phone, identifier 
        FROM users 
        WHERE LOWER(email) = LOWER(${cleanIdentifier}) 
           OR LOWER(identifier) = LOWER(${cleanIdentifier})
        LIMIT 1
      `;

      if (users && users.length > 0) {
        const user = users[0];
        const response = NextResponse.json({ success: true, user });
        const cookieValue = Buffer.from(JSON.stringify(user)).toString('base64');
        response.cookies.set('gkac_session', cookieValue, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24 * 7,
          path: '/',
        });
        return response;
      }
    }

    // Default / Seed users
    const demoUsers = [
      {
        id: 'usr_admin',
        email: 'admin@gkac.edu.ng',
        name: 'Principal Administrator',
        role: 'ADMIN',
        identifier: 'GKAC/ADM/001'
      },
      {
        id: 'usr_teacher',
        email: 'teacher@gkac.edu.ng',
        name: 'Mr. David Adebayo',
        role: 'TEACHER',
        identifier: 'GKAC/STF/2026/001'
      },
      {
        id: 'usr_student',
        email: 'adeyemi@gmail.com',
        name: 'Emmanuel Adeyemi',
        role: 'STUDENT',
        identifier: 'GKAC/PRI/2026/001'
      }
    ];

    const found = demoUsers.find(
      u => u.email.toLowerCase() === cleanIdentifier.toLowerCase() ||
           u.identifier.toLowerCase() === cleanIdentifier.toLowerCase()
    );

    const user = found || {
      id: `usr_${Date.now()}`,
      email: cleanIdentifier.includes('@') ? cleanIdentifier : `${cleanIdentifier.toLowerCase().replace(/[^a-z0-9]/g, '')}@gkac.edu.ng`,
      name: cleanIdentifier.toUpperCase(),
      role: cleanIdentifier.includes('STF') ? 'TEACHER' : (cleanIdentifier.includes('ADM') ? 'ADMIN' : 'STUDENT'),
      identifier: cleanIdentifier
    };

    const response = NextResponse.json({ success: true, user });
    const cookieValue = Buffer.from(JSON.stringify(user)).toString('base64');
    response.cookies.set('gkac_session', cookieValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Login failed' }, { status: 500 });
  }
}
