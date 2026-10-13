'use client';

import React, { useState } from 'react';
import { useAcademic } from '@/context/AcademicContext';
import { Score } from '@/types';
import { calculateGrade, ALL_CLASSES, CLASS_ARMS } from '@/lib/constants';
import {
  FileText,
  Save,
  CheckCircle2,
  Calendar,
  BookOpen,
  AlertCircle
} from 'lucide-react';

export default function ScoresPage() {
  const { students, subjects, activeSession, activeTerm, getScores, saveScores } = useAcademic();
  const [selectedClass, setSelectedClass] = useState('Basic 4');
  const [selectedArm, setSelectedArm] = useState('Gold');
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || 'sub_1');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const classStudents = students.filter(
    s => s.classLevel === selectedClass && s.arm === selectedArm
  );

  const existingScores = getScores(undefined, activeSession, activeTerm);

  // Score state: studentId -> { ca1, ca2, exam }
  const [scoreInputs, setScoreInputs] = useState<Record<string, { ca1: number; ca2: number; exam: number }>>({});

  React.useEffect(() => {
    const map: Record<string, { ca1: number; ca2: number; exam: number }> = {};
    classStudents.forEach(s => {
      const found = existingScores.find(
        sc => sc.studentId === s.id && sc.subjectId === selectedSubjectId
      );
      if (found) {
        map[s.id] = { ca1: found.ca1, ca2: found.ca2, exam: found.exam };
      } else {
        map[s.id] = { ca1: 0, ca2: 0, exam: 0 };
      }
    });
    setScoreInputs(map);
    setSaveSuccess(false);
  }, [selectedClass, selectedArm, selectedSubjectId, activeSession, activeTerm, students.length]);

  const handleScoreChange = (studentId: string, field: 'ca1' | 'ca2' | 'exam', val: string) => {
    let num = Number(val) || 0;
    if (field === 'ca1' || field === 'ca2') {
      if (num > 20) num = 20;
    } else if (field === 'exam') {
      if (num > 60) num = 60;
    }
    if (num < 0) num = 0;

    setScoreInputs(prev => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || { ca1: 0, ca2: 0, exam: 0 }),
        [field]: num,
      }
    }));
    setSaveSuccess(false);
  };

  const handleSaveAllScores = async () => {
    setSaving(true);
    const scoreRecords: Partial<Score>[] = classStudents.map(s => {
      const sc = scoreInputs[s.id] || { ca1: 0, ca2: 0, exam: 0 };
      const total = sc.ca1 + sc.ca2 + sc.exam;
      const { grade, remark } = calculateGrade(total);
      return {
        studentId: s.id,
        subjectId: selectedSubjectId,
        session: activeSession,
        term: activeTerm,
        ca1: sc.ca1,
        ca2: sc.ca2,
        exam: sc.exam,
        total,
        grade,
        remark,
      };
    });

    await saveScores(scoreRecords);
    setSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  const selectedSubject = subjects.find(s => s.id === selectedSubjectId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-black text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-amber-400" />
            CA Scores &amp; Terminal Exam Input
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Enter CA 1 (Max 20), CA 2 (Max 20), and Terminal Exam (Max 60) scores. Automatically computes 100-mark totals, letter grades, and remarks.
          </p>
        </div>

        <button
          onClick={handleSaveAllScores}
          disabled={saving || classStudents.length === 0}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-blue-950 font-bold text-xs shadow-md shadow-amber-400/20 transition-all cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving Scores...' : 'Save Assessment Scores'}</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Continuous Assessment scores saved successfully to Neon PostgreSQL!</span>
        </div>
      )}

      {/* Selectors Banner */}
      <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
            Subject
          </label>
          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-semibold"
          >
            {subjects.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.code})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
            Class Level
          </label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs"
          >
            {ALL_CLASSES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
            Class Arm
          </label>
          <select
            value={selectedArm}
            onChange={(e) => setSelectedArm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs"
          >
            {CLASS_ARMS.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Score Grid Table */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-3 bg-blue-950/60 border-b border-blue-900/50 flex items-center justify-between text-xs">
          <div className="font-bold text-white flex items-center gap-2">
            <span>Subject: {selectedSubject?.name}</span>
            <span className="text-amber-300 font-mono">({selectedSubject?.code})</span>
          </div>
          <div className="text-[11px] text-slate-400">
            {activeSession} &bull; {activeTerm}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B1A36] text-slate-300 uppercase tracking-wider font-semibold border-b border-blue-900/50">
              <tr>
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Admission No</th>
                <th className="py-3 px-4 text-center w-28">CA 1 (20)</th>
                <th className="py-3 px-4 text-center w-28">CA 2 (20)</th>
                <th className="py-3 px-4 text-center w-28">Exam (60)</th>
                <th className="py-3 px-4 text-center w-24">Total (100)</th>
                <th className="py-3 px-4 text-center w-20">Grade</th>
                <th className="py-3 px-4">Automatic Remark</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {classStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No students found in {selectedClass} ({selectedArm}).
                  </td>
                </tr>
              ) : (
                classStudents.map((s, idx) => {
                  const sc = scoreInputs[s.id] || { ca1: 0, ca2: 0, exam: 0 };
                  const total = sc.ca1 + sc.ca2 + sc.exam;
                  const { grade, remark } = calculateGrade(total);

                  return (
                    <tr key={s.id} className="hover:bg-slate-750 transition-colors">
                      <td className="py-3 px-4 text-center text-slate-400 font-mono">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-4 font-bold text-white">
                        {s.firstName} {s.lastName}
                      </td>
                      <td className="py-3 px-4 font-mono text-amber-300">
                        {s.admissionNo}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <input
                          type="number"
                          min={0}
                          max={20}
                          value={sc.ca1}
                          onChange={(e) => handleScoreChange(s.id, 'ca1', e.target.value)}
                          className="w-20 text-center py-1.5 px-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono font-bold focus:ring-2 focus:ring-amber-500"
                        />
                      </td>
                      <td className="py-3 px-4 text-center">
                        <input
                          type="number"
                          min={0}
                          max={20}
                          value={sc.ca2}
                          onChange={(e) => handleScoreChange(s.id, 'ca2', e.target.value)}
                          className="w-20 text-center py-1.5 px-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono font-bold focus:ring-2 focus:ring-amber-500"
                        />
                      </td>
                      <td className="py-3 px-4 text-center">
                        <input
                          type="number"
                          min={0}
                          max={60}
                          value={sc.exam}
                          onChange={(e) => handleScoreChange(s.id, 'exam', e.target.value)}
                          className="w-20 text-center py-1.5 px-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono font-bold focus:ring-2 focus:ring-amber-500"
                        />
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-black text-sm text-amber-400">
                        {total}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-block w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center ${
                          grade === 'A'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : grade === 'B'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : grade === 'C'
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                            : grade === 'D' || grade === 'E'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}>
                          {grade}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[11px] text-slate-300 font-medium">
                        {remark}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
