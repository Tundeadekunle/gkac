import { neon } from '@neondatabase/serverless';
import { getEnvConfig } from './env';

export async function getDb() {
  const { databaseUrl } = getEnvConfig();
  if (!databaseUrl) {
    return null;
  }
  try {
    const sql = neon(databaseUrl);
    return sql;
  } catch (err) {
    console.error('Failed to initialize Neon client:', err);
    return null;
  }
}

export async function initNeonTables() {
  const sql = await getDb();
  if (!sql) return false;

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(64) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(32) NOT NULL DEFAULT 'STUDENT',
        phone VARCHAR(64),
        identifier VARCHAR(128) UNIQUE,
        password_hash VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS students (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64),
        admission_no VARCHAR(64) UNIQUE NOT NULL,
        first_name VARCHAR(128) NOT NULL,
        last_name VARCHAR(128) NOT NULL,
        other_name VARCHAR(128),
        gender VARCHAR(16) NOT NULL,
        date_of_birth DATE,
        section VARCHAR(32) NOT NULL,
        class_level VARCHAR(64) NOT NULL,
        arm VARCHAR(32) NOT NULL,
        guardian_name VARCHAR(255),
        guardian_phone VARCHAR(64),
        guardian_email VARCHAR(255),
        guardian_address TEXT,
        status VARCHAR(32) DEFAULT 'ACTIVE',
        enroll_date DATE DEFAULT CURRENT_DATE,
        results_approved BOOLEAN DEFAULT FALSE,
        results_approved_by VARCHAR(128),
        results_approved_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS teachers (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64),
        staff_id VARCHAR(64) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(64),
        title VARCHAR(64),
        qualification VARCHAR(255),
        assigned_section VARCHAR(32) NOT NULL,
        assigned_classes TEXT,
        assigned_subjects TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS subjects (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        code VARCHAR(32) UNIQUE NOT NULL,
        section VARCHAR(32) NOT NULL,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS scores (
        id VARCHAR(64) PRIMARY KEY,
        student_id VARCHAR(64) NOT NULL,
        subject_id VARCHAR(64) NOT NULL,
        session VARCHAR(32) NOT NULL,
        term VARCHAR(32) NOT NULL,
        ca1 NUMERIC(5,2) DEFAULT 0,
        ca2 NUMERIC(5,2) DEFAULT 0,
        exam NUMERIC(5,2) DEFAULT 0,
        total NUMERIC(5,2) DEFAULT 0,
        grade VARCHAR(4) NOT NULL,
        remark VARCHAR(255),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS attendances (
        id VARCHAR(64) PRIMARY KEY,
        student_id VARCHAR(64) NOT NULL,
        date DATE NOT NULL,
        class_level VARCHAR(64) NOT NULL,
        arm VARCHAR(32) NOT NULL,
        status VARCHAR(32) NOT NULL,
        remarks TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS exams (
        id VARCHAR(64) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        section VARCHAR(32) NOT NULL,
        class_level VARCHAR(64) NOT NULL,
        subject VARCHAR(128) NOT NULL,
        duration_minutes INTEGER NOT NULL,
        total_marks INTEGER NOT NULL,
        pass_percentage INTEGER NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_by VARCHAR(128),
        questions JSONB NOT NULL DEFAULT '[]'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS exam_submissions (
        id VARCHAR(64) PRIMARY KEY,
        exam_id VARCHAR(64) NOT NULL,
        student_id VARCHAR(64) NOT NULL,
        student_name VARCHAR(255),
        admission_no VARCHAR(64),
        score NUMERIC(5,2) NOT NULL,
        total_marks INTEGER NOT NULL,
        percentage NUMERIC(5,2) NOT NULL,
        passed BOOLEAN NOT NULL,
        answers JSONB NOT NULL,
        submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    return true;
  } catch (err) {
    console.error('Neon table migration error:', err);
    return false;
  }
}
