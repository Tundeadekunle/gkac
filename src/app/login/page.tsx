'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Logo } from '@/components/Logo';
import { Watermark } from '@/components/Watermark';
import { Mail, Lock, Eye, EyeOff, Shield, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { SCHOOL_NAME } from '@/lib/constants';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(identifier, password);
    setLoading(false);

    if (res.success) {
      router.push('/dashboard');
    } else {
      setError(res.message || 'Login failed. Please check your credentials.');
    }
  };

  const fillQuickLogin = (id: string) => {
    setIdentifier(id);
    setPassword('password123');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Watermark */}
      <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden" aria-hidden="true">
        <Watermark opacity={0.06} size={480} />
      </div>

      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10 px-4">
        <Link href="/" className="inline-block mb-4">
          <Logo size={64} />
        </Link>
        <h2 className="text-2xl sm:text-3xl font-serif font-black text-white tracking-tight">
          School Management Portal
        </h2>
        <p className="mt-1 text-sm text-amber-300">
          Sign in in real time using your Email, Student Admission No, or Staff ID.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4 sm:px-0">
        <div className="bg-slate-800/90 backdrop-blur-md py-8 px-6 shadow-2xl rounded-2xl border border-blue-800/50 sm:px-10">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-800/50 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Address, Admission No, or Staff ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors font-medium"
                  placeholder="e.g. admin@gkac.edu.ng or GKAC/PRI/2026/001"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                  placeholder="Enter your account password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-800/40 text-[11px] text-blue-300 flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>Real-time authentication with Neon PostgreSQL database.</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-blue-950 bg-amber-400 hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-400 transition-all shadow-lg shadow-amber-400/20 disabled:opacity-50 cursor-pointer"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Logins Helper */}
          <div className="mt-6 pt-4 border-t border-slate-700/60">
            <span className="text-[11px] font-semibold text-slate-400 block mb-2 text-center">
              Quick One-Click Demo Credentials:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillQuickLogin('admin@gkac.edu.ng')}
                className="py-1.5 px-2 rounded-lg bg-blue-900/40 hover:bg-blue-800/60 text-[10px] text-blue-200 font-semibold border border-blue-700/50"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => fillQuickLogin('GKAC/STF/2026/001')}
                className="py-1.5 px-2 rounded-lg bg-emerald-900/40 hover:bg-emerald-800/60 text-[10px] text-emerald-200 font-semibold border border-emerald-700/50"
              >
                Teacher
              </button>
              <button
                type="button"
                onClick={() => fillQuickLogin('GKAC/PRI/2026/001')}
                className="py-1.5 px-2 rounded-lg bg-amber-900/40 hover:bg-amber-800/60 text-[10px] text-amber-200 font-semibold border border-amber-700/50"
              >
                Student
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-700/60 text-center space-y-3">
            <p className="text-xs text-slate-400">
              Don&apos;t have an account yet?{' '}
              <Link
                href="/register"
                className="font-bold text-amber-400 hover:text-amber-300 underline underline-offset-2 transition-colors ml-1"
              >
                Sign Up in Real Time &rarr;
              </Link>
            </p>
            <div>
              <Link
                href="/"
                className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
              >
                &larr; Return to School Homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
