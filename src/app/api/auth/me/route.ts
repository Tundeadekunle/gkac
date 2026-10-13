import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/neon';

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get('gkac_session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ user: null });
    }

    let parsedSession: any = null;
    try {
      parsedSession = JSON.parse(Buffer.from(sessionCookie, 'base64').toString('utf8'));
    } catch {
      return NextResponse.json({ user: null });
    }

    if (!parsedSession || !parsedSession.id) {
      return NextResponse.json({ user: null });
    }

    const sql = await getDb();
    if (sql) {
      const rows = await sql`SELECT id, email, name, role, phone, identifier FROM users WHERE id = ${parsedSession.id} LIMIT 1`;
      if (rows && rows.length > 0) {
        return NextResponse.json({ user: rows[0] });
      }
    }

    return NextResponse.json({ user: parsedSession });
  } catch (err: any) {
    return NextResponse.json({ user: null, error: err.message }, { status: 500 });
  }
}
