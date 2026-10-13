'use client';

import React, { useState } from 'react';
import { useAcademic } from '@/context/AcademicContext';
import { AttendanceRecord } from '@/types';
import {
  CalendarCheck,
  Calendar,
  Save,
  CheckCircle2,
  XCircle,
  Clock,
  HelpCircle,
  Users
} from 'lucide-react';
import { ALL_CLASSES, CLASS_ARMS } from '@/lib/constants';

export default function AttendancePage() {
  const { students, getAttendance, saveAttendance } = useAcademic();
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState<string>('Basic 4');
  const [selectedArm, setSelectedArm] = useState<string>('Gold');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const classStudents = students.filter(
    s => s.classLevel === selectedClass && s.arm === selectedArm
  );

  const existingAttendance = getAttendance(selectedDate, selectedClass, selectedArm);

  // Initialize status map
  const [statusMap, setStatusMap] = useState<Record<string, 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'>>({});

  // Sync statusMap whenever class or date changes
  React.useEffect(() => {
    const map: Record<string, 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'> = {};
    classStudents.forEach(s => {
      const record = existingAttendance.find(a => a.studentId === s.id);
      map[s.id] = record ? record.status : 'PRESENT';
    });
    setStatusMap(map);
    setSavedSuccess(false);
  }, [selectedDate, selectedClass, selectedArm, students.length]);

  const handleStatusChange = (studentId: string, status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED') => {
    setStatusMap(prev => ({ ...prev, [studentId]: status }));
    setSavedSuccess(false);
  };

  const markAll = (status: 'PRESENT' | 'ABSENT') => {
    const map: Record<string, 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'> = {};
    classStudents.forEach(s => {
      map[s.id] = status;
    });
    setStatusMap(map);
    setSavedSuccess(false);
  };

  const handleSaveAttendance = async () => {
    setSaving(true);
    const records: AttendanceRecord[] = classStudents.map(s => ({
      studentId: s.id,
      studentName: `${s.firstName} ${s.lastName}`,
      admissionNo: s.admissionNo,
      date: selectedDate,
      classLevel: selectedClass,
      arm: selectedArm,
      status: statusMap[s.id] || 'PRESENT',
    }));

    await saveAttendance(records);
    setSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const presentCount = Object.values(statusMap).filter(st => st === 'PRESENT' || st === 'LATE').length;
  const absentCount = Object.values(statusMap).filter(st => st === 'ABSENT').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-black text-white flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-cyan-400" />
            Daily Attendance Tracker
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Conduct daily morning roll-calls. Synchronized automatically with terminal report cards.
          </p>
        </div>

        <button
          onClick={handleSaveAttendance}
          disabled={saving || classStudents.length === 0}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-blue-950 font-bold text-xs shadow-md shadow-amber-400/20 transition-all cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving Records...' : 'Save Daily Attendance'}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Daily attendance records saved successfully to Neon database!</span>
        </div>
      )}

      {/* Filter Ribbon */}
      <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Date Selector */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs"
          />
        </div>

        {/* Class Level */}
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

        {/* Class Arm */}
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

      {/* Quick Mark Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-blue-950/40 border border-blue-900/50 rounded-xl text-xs">
        <div className="flex items-center gap-3">
          <span className="text-slate-300 font-semibold">
            {classStudents.length} Students in {selectedClass} ({selectedArm})
          </span>
          <span className="text-emerald-400 font-bold">&bull; {presentCount} Present</span>
          <span className="text-rose-400 font-bold">&bull; {absentCount} Absent</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => markAll('PRESENT')}
            className="px-3 py-1.5 rounded-lg bg-emerald-900/50 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/60 text-[11px] font-bold"
          >
            Mark All Present
          </button>
          <button
            type="button"
            onClick={() => markAll('ABSENT')}
            className="px-3 py-1.5 rounded-lg bg-rose-900/50 hover:bg-rose-800 text-rose-200 border border-rose-700/60 text-[11px] font-bold"
          >
            Mark All Absent
          </button>
        </div>
      </div>

      {/* Roll Call Sheet */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B1A36] text-slate-300 uppercase tracking-wider font-semibold border-b border-blue-900/50">
              <tr>
                <th className="py-3.5 px-4 w-12 text-center">#</th>
                <th className="py-3.5 px-4">Student Name</th>
                <th className="py-3.5 px-4">Admission No</th>
                <th className="py-3.5 px-4 text-center">Attendance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {classStudents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400">
                    No students currently allocated to {selectedClass} - {selectedArm}. Enroll students to take attendance.
                  </td>
                </tr>
              ) : (
                classStudents.map((s, idx) => {
                  const currentStatus = statusMap[s.id] || 'PRESENT';
                  return (
                    <tr key={s.id} className="hover:bg-slate-750 transition-colors">
                      <td className="py-3 px-4 text-center text-slate-400 font-mono">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-4 font-bold text-white">
                        {s.firstName} {s.lastName} {s.otherName || ''}
                      </td>
                      <td className="py-3 px-4 font-mono text-amber-300">
                        {s.admissionNo}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Present Button */}
                          <button
                            type="button"
                            onClick={() => handleStatusChange(s.id, 'PRESENT')}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                              currentStatus === 'PRESENT'
                                ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-700'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Present</span>
                          </button>

                          {/* Absent Button */}
                          <button
                            type="button"
                            onClick={() => handleStatusChange(s.id, 'ABSENT')}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                              currentStatus === 'ABSENT'
                                ? 'bg-rose-500 text-white shadow-md font-black'
                                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-700'
                            }`}
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Absent</span>
                          </button>

                          {/* Late Button */}
                          <button
                            type="button"
                            onClick={() => handleStatusChange(s.id, 'LATE')}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                              currentStatus === 'LATE'
                                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-700'
                            }`}
                          >
                            <Clock className="w-3.5 h-3.5" />
                            <span>Late</span>
                          </button>

                          {/* Excused Button */}
                          <button
                            type="button"
                            onClick={() => handleStatusChange(s.id, 'EXCUSED')}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                              currentStatus === 'EXCUSED'
                                ? 'bg-blue-500 text-white shadow-md font-black'
                                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-700'
                            }`}
                          >
                            <HelpCircle className="w-3.5 h-3.5" />
                            <span>Excused</span>
                          </button>
                        </div>
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
