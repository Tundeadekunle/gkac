import { NextRequest, NextResponse } from 'next/server';
import { getDb, initNeonTables } from '@/lib/neon';

export async function GET() {
  try {
    const sql = await getDb();
    if (sql) {
      await initNeonTables();
      const rows = await sql`
        SELECT 
          id, staff_id as "staffId", name, email, phone, title, qualification,
          assigned_section as "assignedSection", assigned_classes as "assignedClassesRaw",
          assigned_subjects as "assignedSubjectsRaw", created_at as "createdAt"
        FROM teachers 
        ORDER BY created_at DESC
      `;
      const formatted = rows.map((r: any) => ({
        ...r,
        assignedClasses: r.assignedClassesRaw ? r.assignedClassesRaw.split(',') : [],
        assignedSubjects: r.assignedSubjectsRaw ? r.assignedSubjectsRaw.split(',') : [],
      }));
      return NextResponse.json({ success: true, teachers: formatted });
    }
    return NextResponse.json({ success: true, teachers: [] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const id = `tch_${Date.now()}`;
    const teacher = {
      id,
      staffId: data.staffId || `GKAC/STF/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`,
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      title: data.title || null,
      qualification: data.qualification || null,
      assignedSection: data.assignedSection || 'BOTH',
      assignedClasses: data.assignedClasses || [],
      assignedSubjects: data.assignedSubjects || [],
      createdAt: new Date().toISOString()
    };

    const sql = await getDb();
    if (sql) {
      await initNeonTables();
      await sql`
        INSERT INTO teachers (
          id, staff_id, name, email, phone, title, qualification,
          assigned_section, assigned_classes, assigned_subjects
        ) VALUES (
          ${teacher.id}, ${teacher.staffId}, ${teacher.name}, ${teacher.email},
          ${teacher.phone}, ${teacher.title}, ${teacher.qualification},
          ${teacher.assignedSection}, ${teacher.assignedClasses.join(',')}, ${teacher.assignedSubjects.join(',')}
        )
      `;
    }

    return NextResponse.json({ success: true, teacher });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
