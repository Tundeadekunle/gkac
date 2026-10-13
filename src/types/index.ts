export type Section = 'PRIMARY' | 'SECONDARY' | 'BOTH';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';
  phone?: string | null;
  identifier?: string;
  avatar?: string | null;
  createdAt?: string;
}

export interface Student {
  id: string;
  userId?: string;
  admissionNo: string;
  firstName: string;
  lastName: string;
  otherName?: string | null;
  gender: 'MALE' | 'FEMALE';
  dateOfBirth?: string | null;
  section: 'PRIMARY' | 'SECONDARY';
  classLevel: string;
  arm: string;
  guardianName?: string | null;
  guardianPhone?: string | null;
  guardianEmail?: string | null;
  guardianAddress?: string | null;
  status: 'ACTIVE' | 'INACTIVE' | 'GRADUATED';
  enrollDate: string;
  createdAt?: string;
  updatedAt?: string;
  resultsApproved?: boolean;
  resultsApprovedBy?: string | null;
  resultsApprovedAt?: string | null;
  user?: {
    id: string;
    email: string;
    phone?: string | null;
  };
}

export interface Teacher {
  id: string;
  userId?: string;
  staffId: string;
  name: string;
  email: string;
  phone?: string | null;
  title?: string | null;
  qualification?: string | null;
  assignedSection: Section;
  assignedClasses: string[];
  assignedClassesRaw?: string;
  assignedSubjects: string[];
  assignedSubjectsRaw?: string;
  createdAt?: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  section: Section;
  description?: string | null;
  createdAt?: string;
}

export interface Score {
  id: string;
  studentId: string;
  studentName?: string;
  admissionNo?: string;
  subjectId: string;
  subjectName?: string;
  session: string;
  term: string;
  ca1: number; // max 20
  ca2: number; // max 20
  exam: number; // max 60
  total: number; // max 100
  grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  remark: string;
  updatedAt?: string;
  student?: {
    id: string;
    admissionNo: string;
    firstName: string;
    lastName: string;
    classLevel: string;
    arm: string;
    section: 'PRIMARY' | 'SECONDARY';
  };
  subject?: {
    id: string;
    name: string;
    code: string;
  };
}

export interface AttendanceRecord {
  id?: string;
  studentId: string;
  studentName?: string;
  admissionNo?: string;
  date: string;
  classLevel: string;
  arm: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  remarks?: string;
}

export interface Question {
  id: string;
  examId?: string;
  questionNumber: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  marks: number;
  explanation?: string | null;
}

export interface Exam {
  id: string;
  title: string;
  description?: string | null;
  section: 'PRIMARY' | 'SECONDARY';
  classLevel: string;
  subject: string;
  durationMinutes: number;
  totalMarks: number;
  passPercentage: number;
  isActive: boolean;
  createdBy?: string;
  createdAt?: string;
  questions: Question[];
  submissions?: ExamSubmission[];
}

export interface ExamSubmission {
  id: string;
  examId: string;
  studentId: string;
  studentName?: string;
  admissionNo?: string;
  score: number;
  totalMarks: number;
  percentage: number;
  passed: boolean;
  answers: Record<string, string>;
  submittedAt: string;
}

export interface ReportCard {
  id: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  section: 'PRIMARY' | 'SECONDARY';
  session: string;
  term: string;
  classLevel: string;
  arm: string;
  totalScore: number;
  averageScore: number;
  position: number;
  totalStudents: number;
  timesSchoolOpened: number;
  timesPresent: number;
  timesAbsent: number;
  teacherRemark: string;
  principalRemark: string;
  nextTermBegins: string;
  affectiveRating: Record<string, number>;
  psychomotorRating: Record<string, number>;
  scores: Score[];
  resultsApproved: boolean;
  resultsApprovedBy?: string | null;
  resultsApprovedAt?: string | null;
}
