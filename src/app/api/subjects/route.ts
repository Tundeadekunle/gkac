import { NextRequest, NextResponse } from 'next/server';
import { getDb, initNeonTables } from '@/lib/neon';

export async function GET() {
  try {
    const sql = await getDb();
    if (sql) {
      await initNeonTables();
      const rows = await sql`SELECT id, name, code, section, description, created_at as "createdAt" FROM subjects ORDER BY name ASC`;
      return NextResponse.json({ success: true, subjects: rows });
    }
    return NextResponse.json({ success: true, subjects: [] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const id = `sub_${Date.now()}`;
    const subject = {
      id,
      name: data.name,
      code: data.code || data.name.substring(0, 3).toUpperCase(),
      section: data.section || 'BOTH',
      description: data.description || null,
      createdAt: new Date().toISOString()
    };

    const sql = await getDb();
    if (sql) {
      await initNeonTables();
      await sql`
        INSERT INTO subjects (id, name, code, section, description)
        VALUES (${subject.id}, ${subject.name}, ${subject.code}, ${subject.section}, ${subject.description})
        ON CONFLICT (code) DO UPDATE SET name = ${subject.name}, section = ${subject.section}
      `;
    }

    return NextResponse.json({ success: true, subject });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
