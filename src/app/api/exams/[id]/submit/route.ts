import { NextRequest, NextResponse } from 'next/server';
import { getDb, initNeonTables } from '@/lib/neon';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const examId = resolvedParams.id;
    const { studentId, studentName, admissionNo, answers = {} } = await req.json();

    const sql = await getDb();
    let score = 0;
    let totalMarks = 20;
    let passPercentage = 50;

    if (sql) {
      await initNeonTables();
      const examRows = await sql`SELECT * FROM exams WHERE id = ${examId} LIMIT 1`;
      if (examRows && examRows.length > 0) {
        const exam = examRows[0];
        totalMarks = exam.total_marks;
        passPercentage = exam.pass_percentage;
        const questions = Array.isArray(exam.questions) ? exam.questions : [];
        questions.forEach((q: any) => {
          if (answers[q.id] === q.correctAnswer) {
            score += Number(q.marks) || 10;
          }
        });
      }
    }

    const percentage = totalMarks > 0 ? (score / totalMarks) * 100 : 0;
    const passed = percentage >= passPercentage;

    const submission = {
      id: `subm_${Date.now()}`,
      examId,
      studentId: studentId || 'stu_1',
      studentName: studentName || 'Student',
      admissionNo: admissionNo || 'GKAC/PRI/2026/001',
      score,
      totalMarks,
      percentage,
      passed,
      answers,
      submittedAt: new Date().toISOString()
    };

    if (sql) {
      await sql`
        INSERT INTO exam_submissions (
          id, exam_id, student_id, student_name, admission_no,
          score, total_marks, percentage, passed, answers
        ) VALUES (
          ${submission.id}, ${submission.examId}, ${submission.studentId},
          ${submission.studentName}, ${submission.admissionNo}, ${submission.score},
          ${submission.totalMarks}, ${submission.percentage}, ${submission.passed},
          ${JSON.stringify(submission.answers)}::jsonb
        )
      `;
    }

    return NextResponse.json({ success: true, submission });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
