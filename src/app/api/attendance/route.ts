import { NextRequest, NextResponse } from 'next/server';
import { getDb, initNeonTables } from '@/lib/neon';

export async function GET() {
  try {
    const sql = await getDb();
    if (sql) {
      await initNeonTables();
      const rows = await sql`
        SELECT id, student_id as "studentId", date, class_level as "classLevel", arm, status, remarks
        FROM attendances
        ORDER BY date DESC
      `;
      return NextResponse.json({ success: true, attendances: rows });
    }
    return NextResponse.json({ success: true, attendances: [] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { records } = await req.json();
    if (!Array.isArray(records)) {
      return NextResponse.json({ error: 'records array required' }, { status: 400 });
    }

    const sql = await getDb();
    if (sql) {
      await initNeonTables();
      for (const rec of records) {
        const id = `att_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
        await sql`
          INSERT INTO attendances (id, student_id, date, class_level, arm, status, remarks)
          VALUES (${id}, ${rec.studentId}, ${rec.date}, ${rec.classLevel}, ${rec.arm}, ${rec.status}, ${rec.remarks || null})
        `;
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
