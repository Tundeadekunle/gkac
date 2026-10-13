import { NextRequest, NextResponse } from 'next/server';
import { getDb, initNeonTables } from '@/lib/neon';

export async function GET() {
  try {
    const sql = await getDb();
    if (sql) {
      await initNeonTables();
      const rows = await sql`
        SELECT 
          id, user_id as "userId", admission_no as "admissionNo", 
          first_name as "firstName", last_name as "lastName", other_name as "otherName",
          gender, date_of_birth as "dateOfBirth", section, class_level as "classLevel",
          arm, guardian_name as "guardianName", guardian_phone as "guardianPhone",
          guardian_email as "guardianEmail", guardian_address as "guardianAddress",
          status, enroll_date as "enrollDate", results_approved as "resultsApproved",
          created_at as "createdAt"
        FROM students 
        ORDER BY created_at DESC
      `;
      return NextResponse.json({ success: true, students: rows });
    }
    return NextResponse.json({ success: true, students: [] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const id = `stu_${Date.now()}`;
    const student = {
      id,
      admissionNo: data.admissionNo || `GKAC/${data.section === 'PRIMARY' ? 'PRI' : 'COL'}/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`,
      firstName: data.firstName,
      lastName: data.lastName,
      otherName: data.otherName || '',
      gender: data.gender || 'MALE',
      dateOfBirth: data.dateOfBirth || null,
      section: data.section || 'PRIMARY',
      classLevel: data.classLevel,
      arm: data.arm || 'Gold',
      guardianName: data.guardianName || null,
      guardianPhone: data.guardianPhone || null,
      guardianEmail: data.guardianEmail || null,
      guardianAddress: data.guardianAddress || null,
      status: 'ACTIVE',
      enrollDate: new Date().toISOString().split('T')[0],
      resultsApproved: true
    };

    const sql = await getDb();
    if (sql) {
      await initNeonTables();
      await sql`
        INSERT INTO students (
          id, admission_no, first_name, last_name, other_name, gender,
          section, class_level, arm, guardian_name, guardian_phone,
          guardian_email, guardian_address, status, enroll_date, results_approved
        ) VALUES (
          ${student.id}, ${student.admissionNo}, ${student.firstName}, ${student.lastName},
          ${student.otherName}, ${student.gender}, ${student.section}, ${student.classLevel},
          ${student.arm}, ${student.guardianName}, ${student.guardianPhone}, ${student.guardianEmail},
          ${student.guardianAddress}, ${student.status}, ${student.enrollDate}, ${student.resultsApproved}
        )
      `;
    }

    return NextResponse.json({ success: true, student });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
