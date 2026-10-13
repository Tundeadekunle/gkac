'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useAcademic } from '@/context/AcademicContext';
import { Logo } from '@/components/Logo';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  CalendarCheck,
  FileText,
  Monitor,
  Award,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Calendar,
  Sparkles,
  Database
} from 'lucide-react';
import { SCHOOL_NAME } from '@/lib/constants';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/students', label: 'Pupils & Students', icon: Users },
  { href: '/dashboard/teachers', label: 'Teachers & Staff', icon: GraduationCap },
  { href: '/dashboard/subjects', label: 'Curriculum & Subjects', icon: BookOpen },
  { href: '/dashboard/attendance', label: 'Daily Attendance', icon: CalendarCheck },
  { href: '/dashboard/scores', label: 'CA & Exam Scores', icon: FileText },
  { href: '/dashboard/exam-portal', label: 'CBT Exam Portal', icon: Monitor },
  { href: '/dashboard/results', label: 'Watermarked Reports', icon: Award },
  { href: '/dashboard/profile', label: 'My Profile', icon: User },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { activeSession, activeTerm, sessions, terms, setActivePeriod, isSynced } = useAcademic();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [periodDropdownOpen, setPeriodDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#0B1A36] border-b border-blue-900/60 sticky top-0 z-50">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Logo size={36} showText={false} />
          <span className="font-serif font-black text-white text-sm">GLORIOUS KING</span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-blue-900/50 text-slate-200"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar (Desktop & Mobile Drawer) */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0B1A36] border-r border-blue-900/50 flex flex-col transition-transform duration-300 md:static md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-blue-900/40">
          <Link href="/dashboard" className="flex items-center gap-3">
            <Logo size={42} />
          </Link>
        </div>

        {/* Academic Session & Term Selector */}
        <div className="p-3 border-b border-blue-900/40 relative">
          <button
            onClick={() => setPeriodDropdownOpen(!periodDropdownOpen)}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-blue-950/80 border border-blue-800/60 text-xs hover:border-amber-400/60 transition-colors"
          >
            <div className="flex items-center gap-2 text-left">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <div>
                <div className="font-bold text-white">{activeSession}</div>
                <div className="text-[10px] text-amber-300 font-medium">{activeTerm}</div>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Period Dropdown */}
          {periodDropdownOpen && (
            <div className="absolute top-full left-3 right-3 mt-1 p-2 rounded-xl bg-slate-800 border border-slate-700 shadow-2xl z-50 space-y-2 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 font-semibold block mb-1">Session</label>
                <select
                  value={activeSession}
                  onChange={(e) => setActivePeriod(e.target.value, activeTerm)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-white text-xs"
                >
                  {sessions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-semibold block mb-1">Term</label>
                <select
                  value={activeTerm}
                  onChange={(e) => setActivePeriod(activeSession, e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-white text-xs"
                >
                  {terms.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => setPeriodDropdownOpen(false)}
                className="w-full py-1 bg-amber-400 text-blue-950 rounded-lg font-bold text-[11px] mt-1"
              >
                Done
              </button>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? 'bg-amber-400 text-blue-950 shadow-md font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-blue-900/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-blue-950' : 'text-blue-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Neon Status & User Footer */}
        <div className="p-3 border-t border-blue-900/40 space-y-2">
          {/* Neon DB indicator */}
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-blue-950/60 border border-blue-800/40 text-[10px] text-blue-300">
            <span className="flex items-center gap-1.5 font-medium">
              <Database className="w-3 h-3 text-emerald-400" />
              NeonAuth Sync
            </span>
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>

          {/* User profile info & logout */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-xs border border-amber-400/30 flex-shrink-0">
                {user?.name ? user.name[0].toUpperCase() : 'G'}
              </div>
              <div className="truncate text-left">
                <div className="text-xs font-bold text-white truncate">
                  {user?.name || 'Administrator'}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {user?.role || 'ADMIN'} &bull; {user?.identifier || 'GKAC'}
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-red-950/40 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
