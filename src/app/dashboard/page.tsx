'use client';

import React from 'react';
import Link from 'next/link';
import { useAcademic } from '@/context/AcademicContext';
import { useAuth } from '@/context/AuthContext';
import {
  Users,
  GraduationCap,
  BookOpen,
  CalendarCheck,
  FileText,
  Monitor,
  Award,
  ArrowRight,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  Bell
} from 'lucide-react';
import { SCHOOL_NAME } from '@/lib/constants';

export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const { students, teachers, subjects, exams, activeSession, activeTerm } = useAcademic();

  const primaryCount = students.filter(s => s.section === 'PRIMARY').length;
  const secondaryCount = students.filter(s => s.section === 'SECONDARY').length;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950 via-[#0B1A36] to-slate-900 border border-blue-800/60 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-gradient-to-l from-amber-500/10 to-transparent pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-900/60 border border-blue-700/50 text-amber-300 text-[11px] font-semibold mb-2">
              <Sparkles className="w-3 h-3" />
              Active Academic Session: {activeSession} &bull; {activeTerm}
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-black text-white">
              Welcome, {user?.name || 'Educator'}!
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Glorious King Academy and College administrative hub. Manage your students, daily attendance, assessments, CBT exams, and generate watermarked report cards.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/students"
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-blue-950 font-bold text-xs shadow-md shadow-amber-400/20 transition-all flex items-center gap-1.5"
            >
              <Users className="w-4 h-4" />
              <span>Enroll Student</span>
            </Link>
            <Link
              href="/dashboard/results"
              className="px-4 py-2.5 rounded-xl bg-blue-800/80 hover:bg-blue-700 text-white font-bold text-xs border border-blue-600/50 transition-all flex items-center gap-1.5"
            >
              <Award className="w-4 h-4" />
              <span>Report Cards</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/60 hover:border-blue-500/50 transition-all shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Enrolled</span>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-white">{students.length}</div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
              <span className="text-emerald-400">{primaryCount} Primary</span> &bull; 
              <span className="text-cyan-400">{secondaryCount} College</span>
            </div>
          </div>
        </div>

        {/* Total Teachers */}
        <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/60 hover:border-emerald-500/50 transition-all shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Teachers &amp; Staff</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-white">{teachers.length}</div>
            <div className="text-[11px] text-slate-400 mt-1">
              Active academic instructors
            </div>
          </div>
        </div>

        {/* Curriculum Subjects */}
        <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/60 hover:border-amber-500/50 transition-all shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Curriculum Subjects</span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-white">{subjects.length}</div>
            <div className="text-[11px] text-slate-400 mt-1">
              Approved NERDC course modules
            </div>
          </div>
        </div>

        {/* CBT Exams */}
        <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/60 hover:border-indigo-500/50 transition-all shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">CBT Assessments</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Monitor className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-white">{exams.length}</div>
            <div className="text-[11px] text-slate-400 mt-1">
              Computer-Based Tests published
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Hub */}
      <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span>Quick Administrative Portals</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/dashboard/attendance"
            className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 hover:border-cyan-500/60 transition-all group flex items-start gap-3"
          >
            <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-900 transition-colors">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white group-hover:text-cyan-300">Daily Roll Call</div>
              <div className="text-xs text-slate-400 mt-0.5">Take student attendance for today</div>
            </div>
          </Link>

          <Link
            href="/dashboard/scores"
            className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 hover:border-amber-500/60 transition-all group flex items-start gap-3"
          >
            <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-900 transition-colors">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white group-hover:text-amber-300">Continuous Assessment</div>
              <div className="text-xs text-slate-400 mt-0.5">Input CA1, CA2 &amp; Terminal Exam scores</div>
            </div>
          </Link>

          <Link
            href="/dashboard/exam-portal"
            className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 hover:border-indigo-500/60 transition-all group flex items-start gap-3"
          >
            <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-slate-900 transition-colors">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white group-hover:text-indigo-300">CBT Exam Hall</div>
              <div className="text-xs text-slate-400 mt-0.5">Launch timed Computer-Based exams</div>
            </div>
          </Link>

          <Link
            href="/dashboard/results"
            className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 hover:border-sky-500/60 transition-all group flex items-start gap-3"
          >
            <div className="p-2.5 rounded-lg bg-sky-500/10 text-sky-400 group-hover:bg-sky-500 group-hover:text-slate-900 transition-colors">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white group-hover:text-sky-300">Terminal Report Cards</div>
              <div className="text-xs text-slate-400 mt-0.5">Generate watermarked PDF result sheets</div>
            </div>
          </Link>

          <Link
            href="/dashboard/teachers"
            className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 hover:border-emerald-500/60 transition-all group flex items-start gap-3"
          >
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-900 transition-colors">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white group-hover:text-emerald-300">Staff Directory</div>
              <div className="text-xs text-slate-400 mt-0.5">Manage teachers and class allocations</div>
            </div>
          </Link>

          <Link
            href="/dashboard/subjects"
            className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 hover:border-blue-500/60 transition-all group flex items-start gap-3"
          >
            <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-slate-900 transition-colors">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white group-hover:text-blue-300">Curriculum Subjects</div>
              <div className="text-xs text-slate-400 mt-0.5">Configure course codes and sections</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
