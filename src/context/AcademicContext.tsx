'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Student, Teacher, Subject, Score, AttendanceRecord, Exam, ExamSubmission, ReportCard, Section } from '@/types';
import { INITIAL_SUBJECTS, calculateGrade } from '@/lib/constants';

interface AcademicContextType {
  students: Student[];
  teachers: Teacher[];
  subjects: Subject[];
  scores: Score[];
  attendances: AttendanceRecord[];
  exams: Exam[];
  submissions: ExamSubmission[];
  activeSession: string;
  activeTerm: string;
  sessions: string[];
  terms: string[];
  isSynced: boolean;
  syncFromNeon: () => Promise<void>;
  getStudents: (filter?: { section?: string; classLevel?: string }) => Student[];
  getStudentById: (id: string) => Student | undefined;
  addStudent: (student: Partial<Student>) => Promise<Student>;
  getTeachers: () => Teacher[];
  addTeacher: (teacher: Partial<Teacher>) => Promise<Teacher>;
  getSubjects: (section?: Section) => Subject[];
  addSubject: (subject: Partial<Subject>) => Promise<Subject>;
  getAttendance: (date: string, classLevel?: string, arm?: string) => AttendanceRecord[];
  saveAttendance: (records: AttendanceRecord[]) => Promise<boolean>;
  getScores: (studentId?: string, session?: string, term?: string) => Score[];
  saveScores: (newScores: Partial<Score>[]) => Promise<boolean>;
  getStudentReportCard: (studentId: string, session?: string, term?: string) => ReportCard | null;
  getExams: (classLevel?: string, section?: string) => Exam[];
  getExamById: (id: string) => Exam | undefined;
  addExam: (exam: Partial<Exam>) => Promise<Exam>;
  submitExam: (submission: Partial<ExamSubmission> & { examId: string; answers: Record<string, string> }) => Promise<ExamSubmission>;
  getSubmissions: (studentId?: string, examId?: string) => ExamSubmission[];
  getActivePeriod: () => { session: string; term: string; sessions: string[]; terms: string[] };
  setActivePeriod: (session: string, term: string) => { session: string; term: string };
  addSession: (session: string) => string[];
}

const AcademicContext = createContext<AcademicContextType | null>(null);

export const AcademicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>([
    {
      id: 'stu_1',
      admissionNo: 'GKAC/PRI/2026/001',
      firstName: 'Emmanuel',
      lastName: 'Adeyemi',
      otherName: 'Oluwaseun',
      gender: 'MALE',
      section: 'PRIMARY',
      classLevel: 'Basic 4',
      arm: 'Gold',
      status: 'ACTIVE',
      enrollDate: '2026-01-10',
      guardianName: 'Dr. Michael Adeyemi',
      guardianPhone: '+234 803 111 2233',
      guardianEmail: 'adeyemi@gmail.com',
      resultsApproved: true
    },
    {
      id: 'stu_2',
      admissionNo: 'GKAC/PRI/2026/002',
      firstName: 'Favour',
      lastName: 'Okonkwo',
      otherName: 'Chiamaka',
      gender: 'FEMALE',
      section: 'PRIMARY',
      classLevel: 'Basic 4',
      arm: 'Gold',
      status: 'ACTIVE',
      enrollDate: '2026-01-10',
      guardianName: 'Mrs. Blessing Okonkwo',
      guardianPhone: '+234 802 333 4455',
      guardianEmail: 'okonkwo@gmail.com',
      resultsApproved: true
    },
    {
      id: 'stu_3',
      admissionNo: 'GKAC/COL/2026/001',
      firstName: 'Joshua',
      lastName: 'Ibrahim',
      otherName: 'Ojo',
      gender: 'MALE',
      section: 'SECONDARY',
      classLevel: 'JSS 1',
      arm: 'Diamond',
      status: 'ACTIVE',
      enrollDate: '2026-01-12',
      guardianName: 'Pastor Ibrahim',
      guardianPhone: '+234 805 777 8899',
      guardianEmail: 'ibrahim@gmail.com',
      resultsApproved: true
    }
  ]);

  const [teachers, setTeachers] = useState<Teacher[]>([
    {
      id: 'tch_1',
      staffId: 'GKAC/STF/2026/001',
      name: 'Mr. David Adebayo',
      email: 'david.adebayo@gkac.edu.ng',
      phone: '+234 803 555 1212',
      title: 'Head of Sciences',
      qualification: 'B.Sc (Ed) Mathematics, M.Ed',
      assignedSection: 'BOTH',
      assignedClasses: ['Basic 4', 'JSS 1', 'SSS 1 (Science)'],
      assignedSubjects: ['Mathematics', 'Basic Science & Technology'],
      createdAt: new Date().toISOString()
    },
    {
      id: 'tch_2',
      staffId: 'GKAC/STF/2026/002',
      name: 'Mrs. Grace Johnson',
      email: 'grace.johnson@gkac.edu.ng',
      phone: '+234 802 666 3434',
      title: 'Lead English Educator',
      qualification: 'B.A (Ed) English Language',
      assignedSection: 'BOTH',
      assignedClasses: ['Basic 4', 'JSS 1', 'SSS 2 (Arts)'],
      assignedSubjects: ['English Language', 'Letter Work'],
      createdAt: new Date().toISOString()
    }
  ]);

  const [subjects, setSubjects] = useState<Subject[]>(INITIAL_SUBJECTS);
  const [scores, setScores] = useState<Score[]>([
    {
      id: 'scr_1',
      studentId: 'stu_1',
      studentName: 'Emmanuel Adeyemi',
      admissionNo: 'GKAC/PRI/2026/001',
      subjectId: 'sub_1',
      subjectName: 'Mathematics',
      session: '2024/2025',
      term: 'First Term',
      ca1: 18,
      ca2: 19,
      exam: 54,
      total: 91,
      grade: 'A',
      remark: 'Distinction / Excellent'
    },
    {
      id: 'scr_2',
      studentId: 'stu_1',
      studentName: 'Emmanuel Adeyemi',
      admissionNo: 'GKAC/PRI/2026/001',
      subjectId: 'sub_2',
      subjectName: 'English Language',
      session: '2024/2025',
      term: 'First Term',
      ca1: 17,
      ca2: 18,
      exam: 50,
      total: 85,
      grade: 'A',
      remark: 'Distinction / Excellent'
    },
    {
      id: 'scr_3',
      studentId: 'stu_2',
      studentName: 'Favour Okonkwo',
      admissionNo: 'GKAC/PRI/2026/002',
      subjectId: 'sub_1',
      subjectName: 'Mathematics',
      session: '2024/2025',
      term: 'First Term',
      ca1: 16,
      ca2: 17,
      exam: 45,
      total: 78,
      grade: 'A',
      remark: 'Distinction / Excellent'
    }
  ]);

  const [attendances, setAttendances] = useState<AttendanceRecord[]>([]);
  const [exams, setExams] = useState<Exam[]>([
    {
      id: 'cbt_1',
      title: 'Basic 4 Mathematics Assessment',
      description: 'First Term Continuous Assessment CBT test for Basic 4 pupils.',
      section: 'PRIMARY',
      classLevel: 'Basic 4',
      subject: 'Mathematics',
      durationMinutes: 15,
      totalMarks: 20,
      passPercentage: 50,
      isActive: true,
      createdBy: 'Mr. David Adebayo',
      createdAt: new Date().toISOString(),
      questions: [
        {
          id: 'q_1',
          questionNumber: 1,
          questionText: 'What is 15 multiplied by 4?',
          optionA: '50',
          optionB: '60',
          optionC: '70',
          optionD: '45',
          correctAnswer: 'B',
          marks: 10
        },
        {
          id: 'q_2',
          questionNumber: 2,
          questionText: 'Which of the following is an even number?',
          optionA: '21',
          optionB: '35',
          optionC: '48',
          optionD: '59',
          correctAnswer: 'C',
          marks: 10
        }
      ],
      submissions: []
    }
  ]);

  const [submissions, setSubmissions] = useState<ExamSubmission[]>([]);
  const [activeSession, setActiveSession] = useState<string>('2024/2025');
  const [activeTerm, setActiveTerm] = useState<string>('First Term');
  const [sessions, setSessions] = useState<string[]>(['2023/2024', '2024/2025', '2025/2026', '2026/2027']);
  const terms = ['First Term', 'Second Term', 'Third Term'];
  const [isSynced, setIsSynced] = useState<boolean>(false);

  const syncFromNeon = async () => {
    try {
      const [stuRes, tchRes, subRes, scrRes, attRes, exmRes] = await Promise.all([
        fetch('/api/students').catch(() => null),
        fetch('/api/teachers').catch(() => null),
        fetch('/api/subjects').catch(() => null),
        fetch('/api/scores').catch(() => null),
        fetch('/api/attendance').catch(() => null),
        fetch('/api/exams').catch(() => null),
      ]);

      if (stuRes && stuRes.ok) {
        const data = await stuRes.json();
        if (data.students && data.students.length > 0) setStudents(data.students);
      }
      if (tchRes && tchRes.ok) {
        const data = await tchRes.json();
        if (data.teachers && data.teachers.length > 0) setTeachers(data.teachers);
      }
      if (subRes && subRes.ok) {
        const data = await subRes.json();
        if (data.subjects && data.subjects.length > 0) setSubjects(data.subjects);
      }
      if (scrRes && scrRes.ok) {
        const data = await scrRes.json();
        if (data.scores && data.scores.length > 0) setScores(data.scores);
      }
      if (attRes && attRes.ok) {
        const data = await attRes.json();
        if (data.attendances && data.attendances.length > 0) setAttendances(data.attendances);
      }
      if (exmRes && exmRes.ok) {
        const data = await exmRes.json();
        if (data.exams && data.exams.length > 0) setExams(data.exams);
      }
      setIsSynced(true);
    } catch {}
  };

  useEffect(() => {
    syncFromNeon();
  }, []);

  const getStudents = (filter?: { section?: string; classLevel?: string }) => {
    let result = students;
    if (filter?.section && filter.section !== 'ALL') {
      result = result.filter(s => s.section === filter.section);
    }
    if (filter?.classLevel && filter.classLevel !== 'ALL') {
      result = result.filter(s => s.classLevel === filter.classLevel);
    }
    return result;
  };

  const getStudentById = (id: string) => {
    return students.find(s => s.id === id || s.admissionNo === id);
  };

  const addStudent = async (data: Partial<Student>): Promise<Student> => {
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const resData = await res.json();
        if (resData.student) {
          setStudents(prev => [resData.student, ...prev]);
          return resData.student;
        }
      }
    } catch {}

    const seq = students.length + 1;
    const section = data.section || 'PRIMARY';
    const admissionNo = data.admissionNo || `GKAC/${section === 'PRIMARY' ? 'PRI' : 'COL'}/${new Date().getFullYear()}/${String(seq).padStart(3, '0')}`;
    const newStudent: Student = {
      id: `stu_${Date.now()}`,
      admissionNo,
      firstName: data.firstName || 'Student',
      lastName: data.lastName || 'Pupil',
      otherName: data.otherName || '',
      gender: data.gender || 'MALE',
      section,
      classLevel: data.classLevel || 'Basic 1',
      arm: data.arm || 'Gold',
      status: 'ACTIVE',
      enrollDate: new Date().toISOString().split('T')[0],
      guardianName: data.guardianName || '',
      guardianPhone: data.guardianPhone || '',
      guardianEmail: data.guardianEmail || '',
      resultsApproved: true,
      ...data,
    };
    setStudents(prev => [newStudent, ...prev]);
    return newStudent;
  };

  const getTeachers = () => teachers;

  const addTeacher = async (data: Partial<Teacher>): Promise<Teacher> => {
    try {
      const res = await fetch('/api/teachers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const resData = await res.json();
        if (resData.teacher) {
          setTeachers(prev => [resData.teacher, ...prev]);
          return resData.teacher;
        }
      }
    } catch {}

    const seq = teachers.length + 1;
    const newTeacher: Teacher = {
      id: `tch_${Date.now()}`,
      staffId: data.staffId || `GKAC/STF/${new Date().getFullYear()}/${String(seq).padStart(3, '0')}`,
      name: data.name || 'Teacher',
      email: data.email || 'teacher@gkac.edu.ng',
      assignedSection: data.assignedSection || 'BOTH',
      assignedClasses: data.assignedClasses || ['Basic 1'],
      assignedSubjects: data.assignedSubjects || ['Mathematics'],
      createdAt: new Date().toISOString(),
      ...data,
    };
    setTeachers(prev => [newTeacher, ...prev]);
    return newTeacher;
  };

  const getSubjects = (section?: Section) => {
    if (!section || section === 'BOTH') return subjects;
    return subjects.filter(s => s.section === section || s.section === 'BOTH');
  };

  const addSubject = async (data: Partial<Subject>): Promise<Subject> => {
    try {
      const res = await fetch('/api/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const resData = await res.json();
        if (resData.subject) {
          setSubjects(prev => [...prev, resData.subject]);
          return resData.subject;
        }
      }
    } catch {}

    const newSub: Subject = {
      id: `sub_${Date.now()}`,
      name: data.name || 'New Subject',
      code: data.code || (data.name ? data.name.substring(0, 3).toUpperCase() : 'SUB'),
      section: data.section || 'BOTH',
      createdAt: new Date().toISOString(),
      ...data,
    };
    setSubjects(prev => [...prev, newSub]);
    return newSub;
  };

  const getAttendance = (date: string, classLevel?: string, arm?: string) => {
    return attendances.filter(a => {
      const matchDate = a.date.startsWith(date);
      const matchClass = !classLevel || a.classLevel === classLevel;
      const matchArm = !arm || a.arm === arm;
      return matchDate && matchClass && matchArm;
    });
  };

  const saveAttendance = async (records: AttendanceRecord[]): Promise<boolean> => {
    try {
      await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records }),
      });
    } catch {}

    setAttendances(prev => {
      const updated = [...prev];
      records.forEach(rec => {
        const idx = updated.findIndex(u => u.studentId === rec.studentId && u.date.startsWith(rec.date));
        if (idx >= 0) {
          updated[idx] = { ...updated[idx], ...rec };
        } else {
          updated.push({ id: `att_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`, ...rec });
        }
      });
      return updated;
    });
    return true;
  };

  const getScores = (studentId?: string, session?: string, term?: string) => {
    let result = scores;
    if (studentId) result = result.filter(s => s.studentId === studentId);
    if (session) result = result.filter(s => s.session === session);
    if (term) result = result.filter(s => s.term === term);
    return result;
  };

  const saveScores = async (newScores: Partial<Score>[]): Promise<boolean> => {
    try {
      await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scores: newScores }),
      });
    } catch {}

    setScores(prev => {
      const updated = [...prev];
      newScores.forEach(sc => {
        if (!sc.studentId || !sc.subjectId) return;
        const total = (sc.ca1 || 0) + (sc.ca2 || 0) + (sc.exam || 0);
        const { grade, remark } = calculateGrade(total);
        const student = students.find(s => s.id === sc.studentId);
        const subject = subjects.find(s => s.id === sc.subjectId);

        const idx = updated.findIndex(
          u => u.studentId === sc.studentId &&
               u.subjectId === sc.subjectId &&
               u.session === (sc.session || activeSession) &&
               u.term === (sc.term || activeTerm)
        );

        const record: Score = {
          id: idx >= 0 ? updated[idx].id : `scr_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          studentId: sc.studentId,
          studentName: student ? `${student.firstName} ${student.lastName}` : 'Student',
          admissionNo: student?.admissionNo,
          subjectId: sc.subjectId,
          subjectName: subject?.name || 'Subject',
          session: sc.session || activeSession,
          term: sc.term || activeTerm,
          ca1: sc.ca1 || 0,
          ca2: sc.ca2 || 0,
          exam: sc.exam || 0,
          total,
          grade,
          remark,
          updatedAt: new Date().toISOString(),
        };

        if (idx >= 0) {
          updated[idx] = record;
        } else {
          updated.push(record);
        }
      });
      return updated;
    });
    return true;
  };

  const getStudentReportCard = (
    studentId: string,
    session: string = activeSession,
    term: string = activeTerm
  ): ReportCard | null => {
    const student = students.find(s => s.id === studentId || s.admissionNo === studentId);
    if (!student) return null;

    const studentScores = scores.filter(
      s => s.studentId === student.id && s.session === session && s.term === term
    );

    const totalScore = studentScores.reduce((acc, curr) => acc + curr.total, 0);
    const averageScore = studentScores.length > 0 ? Math.round((totalScore / studentScores.length) * 10) / 10 : 0;

    const classPeers = students.filter(s => s.classLevel === student.classLevel && s.arm === student.arm);
    const peerRankings = classPeers.map(peer => {
      const pScores = scores.filter(s => s.studentId === peer.id && s.session === session && s.term === term);
      const sum = pScores.reduce((acc, curr) => acc + curr.total, 0);
      return { id: peer.id, sum };
    });
    peerRankings.sort((a, b) => b.sum - a.sum);
    const positionIndex = peerRankings.findIndex(p => p.id === student.id);
    const position = positionIndex >= 0 ? positionIndex + 1 : 1;

    const studentAtt = attendances.filter(a => a.studentId === student.id);
    const presentCount = studentAtt.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length || 118;
    const absentCount = studentAtt.filter(a => a.status === 'ABSENT').length || 2;

    let teacherRemark = "An exceptionally brilliant, diligent and well-behaved pupil. Has maintained top academic standards.";
    let principalRemark = "Outstanding terminal performance! Keep up this exemplary diligence and dedication.";

    if (averageScore < 50) {
      teacherRemark = "Shows potential but needs to dedicate more hours to study and complete homework.";
      principalRemark = "Has to sit up next term. Extra tutoring strongly advised.";
    } else if (averageScore < 70) {
      teacherRemark = "A good performance with room for greater excellence in analytical subjects.";
      principalRemark = "Commendable progress. Maintain consistency next term.";
    }

    return {
      id: `rep_${student.id}_${session}_${term}`,
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName} ${student.otherName || ''}`.trim(),
      admissionNo: student.admissionNo,
      section: student.section,
      session,
      term,
      classLevel: student.classLevel,
      arm: student.arm,
      totalScore,
      averageScore,
      position,
      totalStudents: classPeers.length || 1,
      timesSchoolOpened: 120,
      timesPresent: presentCount,
      timesAbsent: absentCount,
      teacherRemark,
      principalRemark,
      nextTermBegins: "January 12, 2026",
      affectiveRating: {
        "Punctuality": 5,
        "Neatness & Personal Hygiene": 5,
        "Politeness & Courtesy": 5,
        "Honesty & Reliability": 5,
        "Relationship with Peers": 4,
        "Self Control & Discipline": 5,
        "Attentiveness in Class": 5,
        "Spirit of Co-operation": 4
      },
      psychomotorRating: {
        "Handwriting / Penmanship": 5,
        "Verbal & Reading Fluency": 5,
        "Sports & Physical Games": 4,
        "Arts, Crafts & Creativity": 4,
        "Musical / Cultural Skills": 4,
        "Handling of Tools & Lab Apparatus": 5
      },
      scores: studentScores,
      resultsApproved: Boolean(student.resultsApproved),
      resultsApprovedBy: student.resultsApprovedBy,
      resultsApprovedAt: student.resultsApprovedAt
    };
  };

  const getExams = (classLevel?: string, section?: string) => {
    let result = exams;
    if (section && section !== 'ALL') result = result.filter(e => e.section === section);
    if (classLevel && classLevel !== 'ALL') result = result.filter(e => e.classLevel === classLevel);
    return result;
  };

  const getExamById = (id: string) => exams.find(e => e.id === id);

  const addExam = async (data: Partial<Exam>): Promise<Exam> => {
    try {
      const res = await fetch('/api/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const resData = await res.json();
        if (resData.exam) {
          setExams(prev => [resData.exam, ...prev]);
          return resData.exam;
        }
      }
    } catch {}

    const newExam: Exam = {
      id: `cbt_${Date.now()}`,
      title: data.title || 'New Exam',
      section: data.section || 'PRIMARY',
      classLevel: data.classLevel || 'Basic 4',
      subject: data.subject || 'Mathematics',
      durationMinutes: data.durationMinutes || 20,
      totalMarks: data.totalMarks || 20,
      passPercentage: data.passPercentage || 50,
      isActive: true,
      questions: data.questions || [],
      createdAt: new Date().toISOString(),
      ...data,
    };
    setExams(prev => [newExam, ...prev]);
    return newExam;
  };

  const submitExam = async (submission: Partial<ExamSubmission> & { examId: string; answers: Record<string, string> }): Promise<ExamSubmission> => {
    try {
      const res = await fetch(`/api/exams/${submission.examId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission),
      });
      if (res.ok) {
        const resData = await res.json();
        if (resData.submission) {
          setSubmissions(prev => [resData.submission, ...prev]);
          return resData.submission;
        }
      }
    } catch {}

    const exam = exams.find(e => e.id === submission.examId);
    let score = 0;
    if (exam) {
      exam.questions.forEach(q => {
        if (submission.answers[q.id] === q.correctAnswer) {
          score += q.marks;
        }
      });
    }
    const totalMarks = exam?.totalMarks || 20;
    const percentage = totalMarks > 0 ? (score / totalMarks) * 100 : 0;
    const passed = percentage >= (exam?.passPercentage || 50);

    const newSub: ExamSubmission = {
      id: `subm_${Date.now()}`,
      examId: submission.examId,
      studentId: submission.studentId || 'stu_1',
      studentName: submission.studentName || 'Student',
      admissionNo: submission.admissionNo || 'GKAC/PRI/2026/001',
      score,
      totalMarks,
      percentage,
      passed,
      answers: submission.answers,
      submittedAt: new Date().toISOString(),
    };
    setSubmissions(prev => [newSub, ...prev]);
    return newSub;
  };

  const getSubmissions = (studentId?: string, examId?: string) => {
    let result = submissions;
    if (studentId) result = result.filter(s => s.studentId === studentId);
    if (examId) result = result.filter(s => s.examId === examId);
    return result;
  };

  const getActivePeriod = () => ({
    session: activeSession,
    term: activeTerm,
    sessions,
    terms,
  });

  const setActivePeriod = (session: string, term: string) => {
    setActiveSession(session);
    setActiveTerm(term);
    if (!sessions.includes(session)) {
      setSessions(prev => [...prev, session].sort());
    }
    return { session, term };
  };

  const addSession = (session: string) => {
    const trimmed = session.trim();
    if (trimmed && !sessions.includes(trimmed)) {
      setSessions(prev => [...prev, trimmed].sort());
    }
    return sessions;
  };

  return (
    <AcademicContext.Provider
      value={{
        students,
        teachers,
        subjects,
        scores,
        attendances,
        exams,
        submissions,
        activeSession,
        activeTerm,
        sessions,
        terms,
        isSynced,
        syncFromNeon,
        getStudents,
        getStudentById,
        addStudent,
        getTeachers,
        addTeacher,
        getSubjects,
        addSubject,
        getAttendance,
        saveAttendance,
        getScores,
        saveScores,
        getStudentReportCard,
        getExams,
        getExamById,
        addExam,
        submitExam,
        getSubmissions,
        getActivePeriod,
        setActivePeriod,
        addSession,
      }}
    >
      {children}
    </AcademicContext.Provider>
  );
};

export const useAcademic = () => {
  const context = useContext(AcademicContext);
  if (!context) {
    throw new Error('useAcademic must be used within an AcademicProvider');
  }
  return context;
};
