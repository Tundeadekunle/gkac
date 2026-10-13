import { NextRequest, NextResponse } from 'next/server';
import { getDb, initNeonTables } from '@/lib/neon';

export async function GET() {
  try {
    const sql = await getDb();
    if (sql) {
      await initNeonTables();
      const rows = await sql`
        SELECT 
          s.id, s.student_id as "studentId", s.subject_id as "subjectId",
          s.session, s.term, s.ca1, s.ca2, s.exam, s.total, s.grade, s.remark,
          s.updated_at as "updatedAt",
          stu.admission_no as "admissionNo", stu.first_name as "firstName", stu.last_name as "lastName",
          sub.name as "subjectName", sub.code as "subjectCode"
        FROM scores s
        LEFT JOIN students stu ON s.student_id = stu.id
        LEFT JOIN subjects sub ON s.subject_id = sub.id
        ORDER BY s.updated_at DESC
      `;
      const formatted = rows.map((r: any) => ({
        ...r,
        studentName: `${r.firstName || ''} ${r.lastName || ''}`.trim(),
        student: {
          id: r.studentId,
          admissionNo: r.admissionNo,
          firstName: r.firstName,
          lastName: r.lastName
        },
        subject: {
          id: r.subjectId,
          name: r.subjectName,
          code: r.subjectCode
        }
      }));
      return NextResponse.json({ success: true, scores: formatted });
    }
    return NextResponse.json({ success: true, scores: [] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { scores } = await req.json();
    if (!Array.isArray(scores)) {
      return NextResponse.json({ error: 'scores array required' }, { status: 400 });
    }

    const sql = await getDb();
    if (sql) {
      await initNeonTables();
      for (const sc of scores) {
        const id = `scr_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
        const total = (Number(sc.ca1) || 0) + (Number(sc.ca2) || 0) + (Number(sc.exam) || 0);
        let grade = 'F';
        let remark = 'Fail / Needs Improvement';
        if (total >= 75) { grade = 'A'; remark = 'Distinction / Excellent'; }
        else if (total >= 65) { grade = 'B'; remark = 'Very Good'; }
        else if (total >= 50) { grade = 'C'; remark = 'Credit / Good'; }
        else if (total >= 45) { grade = 'D'; remark = 'Pass / Fair'; }
        else if (total >= 40) { grade = 'E'; remark = 'Weak Pass'; }

        await sql`
          INSERT INTO scores (id, student_id, subject_id, session, term, ca1, ca2, exam, total, grade, remark, updated_at)
          VALUES (${id}, ${sc.studentId}, ${sc.subjectId}, ${sc.session}, ${sc.term}, ${sc.ca1 || 0}, ${sc.ca2 || 0}, ${sc.exam || 0}, ${total}, ${grade}, ${remark}, CURRENT_TIMESTAMP)
        `;
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
