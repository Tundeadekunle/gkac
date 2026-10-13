import { NextRequest, NextResponse } from 'next/server';
import { getDb, initNeonTables } from '@/lib/neon';

export async function GET() {
  try {
    const sql = await getDb();
    if (sql) {
      await initNeonTables();
      const rows = await sql`
        SELECT 
          id, title, description, section, class_level as "classLevel",
          subject, duration_minutes as "durationMinutes", total_marks as "totalMarks",
          pass_percentage as "passPercentage", is_active as "isActive",
          created_by as "createdBy", questions, created_at as "createdAt"
        FROM exams
        ORDER BY created_at DESC
      `;
      return NextResponse.json({ success: true, exams: rows });
    }
    return NextResponse.json({ success: true, exams: [] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const id = `cbt_${Date.now()}`;
    const exam = {
      id,
      title: data.title,
      description: data.description || null,
      section: data.section || 'PRIMARY',
      classLevel: data.classLevel,
      subject: data.subject,
      durationMinutes: Number(data.durationMinutes) || 20,
      totalMarks: Number(data.totalMarks) || 20,
      passPercentage: Number(data.passPercentage) || 50,
      isActive: true,
      createdBy: data.createdBy || 'Educator',
      questions: data.questions || [],
      createdAt: new Date().toISOString()
    };

    const sql = await getDb();
    if (sql) {
      await initNeonTables();
      await sql`
        INSERT INTO exams (
          id, title, description, section, class_level, subject,
          duration_minutes, total_marks, pass_percentage, is_active,
          created_by, questions
        ) VALUES (
          ${exam.id}, ${exam.title}, ${exam.description}, ${exam.section},
          ${exam.classLevel}, ${exam.subject}, ${exam.durationMinutes},
          ${exam.totalMarks}, ${exam.passPercentage}, ${exam.isActive},
          ${exam.createdBy}, ${JSON.stringify(exam.questions)}::jsonb
        )
      `;
    }

    return NextResponse.json({ success: true, exam });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
