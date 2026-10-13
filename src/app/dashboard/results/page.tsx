'use client';

import React, { useState } from 'react';
import { useAcademic } from '@/context/AcademicContext';
import { Logo } from '@/components/Logo';
import { Watermark } from '@/components/Watermark';
import {
  Award,
  Printer,
  Download,
  Calendar,
  User,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { SCHOOL_NAME, SCHOOL_MOTTO, SCHOOL_ADDRESS, SCHOOL_PHONE, SCHOOL_EMAIL, ALL_CLASSES, CLASS_ARMS } from '@/lib/constants';

export default function ResultsPage() {
  const { students, activeSession, activeTerm, getStudentReportCard } = useAcademic();
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');

  const student = students.find(s => s.id === selectedStudentId);
  const report = selectedStudentId ? getStudentReportCard(selectedStudentId, activeSession, activeTerm) : null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Non-printable Control Header */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-black text-white flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-400" />
            Official Terminal Report Cards
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Featuring the Glorious King Academy and College crest watermark, position ranks, and print-ready high-DPI styling.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Select Student */}
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-semibold"
          >
            {students.map(s => (
              <option key={s.id} value={s.id}>
                {s.firstName} {s.lastName} ({s.admissionNo})
              </option>
            ))}
          </select>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-blue-950 font-bold text-xs shadow-md shadow-amber-400/20 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report Card</span>
          </button>
        </div>
      </div>

      {/* The Printable Official Terminal Report Sheet */}
      {report && (
        <div className="bg-white text-slate-900 rounded-2xl shadow-2xl p-6 sm:p-10 border border-slate-300 relative overflow-hidden print:p-0 print:border-none print:shadow-none">
          {/* Centered Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0" aria-hidden="true">
            <Watermark opacity={0.07} size={500} />
          </div>

          <div className="relative z-10 space-y-6">
            {/* Header: School Heraldry & Info */}
            <div className="border-b-2 border-blue-950 pb-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div className="flex items-center gap-4">
                <Logo size={72} showText={false} />
                <div>
                  <h2 className="text-xl sm:text-2xl font-serif font-black tracking-tight text-blue-950">
                    {SCHOOL_NAME.toUpperCase()}
                  </h2>
                  <p className="text-xs font-serif italic text-amber-700 font-semibold">
                    &ldquo;{SCHOOL_MOTTO}&rdquo;
                  </p>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    {SCHOOL_ADDRESS} &bull; Tel: {SCHOOL_PHONE} &bull; Email: {SCHOOL_EMAIL}
                  </p>
                </div>
              </div>

              <div className="sm:text-right border sm:border-0 p-2 sm:p-0 rounded-lg">
                <span className="inline-block px-3 py-1 rounded-full bg-blue-950 text-amber-300 text-xs font-black uppercase tracking-wider mb-1">
                  Terminal Report Sheet
                </span>
                <div className="text-xs font-bold text-slate-800">{report.session} Academic Session</div>
                <div className="text-xs font-semibold text-blue-900">{report.term}</div>
              </div>
            </div>

            {/* Student Profile Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Student Name</span>
                <span className="font-bold text-blue-950 text-sm">{report.studentName}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Admission Number</span>
                <span className="font-mono font-bold text-slate-900">{report.admissionNo}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Class &amp; Arm</span>
                <span className="font-bold text-slate-900">{report.classLevel} - {report.arm}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Wing</span>
                <span className="font-bold text-slate-900">
                  {report.section === 'PRIMARY' ? 'Primary Wing' : 'College Wing'}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Overall Average</span>
                <span className="font-bold text-amber-700 text-sm">{report.averageScore}%</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Terminal Position</span>
                <span className="font-bold text-blue-950 text-sm">
                  {report.position} <span className="text-xs font-normal text-slate-500">out of {report.totalStudents}</span>
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Attendance (Present)</span>
                <span className="font-bold text-slate-900">
                  {report.timesPresent} / {report.timesSchoolOpened} days
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Next Term Begins</span>
                <span className="font-bold text-slate-900">{report.nextTermBegins}</span>
              </div>
            </div>

            {/* Academic Performance Table */}
            <div>
              <h3 className="text-xs uppercase font-black tracking-wider text-blue-950 mb-2 border-b border-blue-900/30 pb-1">
                Cognitive Academic Assessment
              </h3>
              <table className="w-full text-left text-xs border-collapse border border-slate-300">
                <thead className="bg-blue-950 text-white font-bold">
                  <tr>
                    <th className="py-2 px-3 border border-slate-400">Subject Name</th>
                    <th className="py-2 px-2 text-center border border-slate-400 w-16">CA 1 (20)</th>
                    <th className="py-2 px-2 text-center border border-slate-400 w-16">CA 2 (20)</th>
                    <th className="py-2 px-2 text-center border border-slate-400 w-16">Exam (60)</th>
                    <th className="py-2 px-2 text-center border border-slate-400 w-20">Total (100)</th>
                    <th className="py-2 px-2 text-center border border-slate-400 w-14">Grade</th>
                    <th className="py-2 px-3 border border-slate-400">Teacher Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {report.scores.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-4 text-center text-slate-500 border border-slate-300">
                        No continuous assessment scores entered yet for this student.
                      </td>
                    </tr>
                  ) : (
                    report.scores.map((sc, i) => (
                      <tr key={sc.id} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                        <td className="py-2 px-3 font-semibold border border-slate-300">{sc.subjectName}</td>
                        <td className="py-2 px-2 text-center font-mono border border-slate-300">{sc.ca1}</td>
                        <td className="py-2 px-2 text-center font-mono border border-slate-300">{sc.ca2}</td>
                        <td className="py-2 px-2 text-center font-mono border border-slate-300">{sc.exam}</td>
                        <td className="py-2 px-2 text-center font-mono font-bold text-blue-950 border border-slate-300">
                          {sc.total}
                        </td>
                        <td className="py-2 px-2 text-center font-bold border border-slate-300">{sc.grade}</td>
                        <td className="py-2 px-3 text-[11px] border border-slate-300 text-slate-700">{sc.remark}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Affective & Psychomotor Ratings Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Affective Domain */}
              <div className="border border-slate-300 rounded-xl p-3 bg-slate-50">
                <h4 className="text-xs uppercase font-black text-blue-950 mb-2">
                  Affective Traits Evaluation (1 - 5)
                </h4>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
                  {Object.entries(report.affectiveRating).map(([trait, score]) => (
                    <div key={trait} className="flex justify-between border-b border-slate-200 py-0.5">
                      <span className="text-slate-700 truncate">{trait}:</span>
                      <span className="font-bold text-blue-950">{score}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Psychomotor Domain */}
              <div className="border border-slate-300 rounded-xl p-3 bg-slate-50">
                <h4 className="text-xs uppercase font-black text-blue-950 mb-2">
                  Psychomotor Skills Evaluation (1 - 5)
                </h4>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
                  {Object.entries(report.psychomotorRating).map(([skill, score]) => (
                    <div key={skill} className="flex justify-between border-b border-slate-200 py-0.5">
                      <span className="text-slate-700 truncate">{skill}:</span>
                      <span className="font-bold text-blue-950">{score}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Official Remarks & Signatures */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t-2 border-slate-300 pt-3 text-xs">
              <div className="space-y-1">
                <span className="font-bold uppercase text-[10px] text-slate-500">Class Teacher's Remark:</span>
                <p className="italic text-slate-800">&ldquo;{report.teacherRemark}&rdquo;</p>
                <div className="pt-4 text-[10px] text-slate-500">
                  Signature: __________________________
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-bold uppercase text-[10px] text-slate-500">Principal's Official Remark:</span>
                <p className="italic text-slate-800 font-semibold">&ldquo;{report.principalRemark}&rdquo;</p>
                <div className="pt-4 text-[10px] text-slate-500">
                  Stamp &amp; Signature: __________________________
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
