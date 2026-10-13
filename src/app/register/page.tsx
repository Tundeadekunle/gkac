'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useAcademic } from '@/context/AcademicContext';
import { Logo } from '@/components/Logo';
import { Watermark } from '@/components/Watermark';
import {
  User,
  Mail,
  Lock,
  Phone,
  Shield,
  GraduationCap,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ALL_CLASSES, CLASS_ARMS, PRIMARY_CLASSES } from '@/lib/constants';

export default function RegisterPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const { addStudent, addTeacher } = useAcademic();

  const [role, setRole] = useState<'STUDENT' | 'TEACHER' | 'ADMIN'>('STUDENT');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [section, setSection] = useState<'PRIMARY' | 'SECONDARY'>('PRIMARY');
  const [classLevel, setClassLevel] = useState('Basic 1');
  const [arm, setArm] = useState('Gold');
  const [qualification, setQualification] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await signup({
      name,
      email,
      phone,
      role,
      password,
    });

    if (res.success && res.user) {
      if (role === 'STUDENT') {
        const parts = name.split(' ');
        const firstName = parts[0] || name;
        const lastName = parts.slice(1).join(' ') || 'Pupil';
        await addStudent({
          userId: res.user.id,
          firstName,
          lastName,
          section,
          classLevel,
          arm,
          guardianPhone: phone,
          guardianEmail: email,
        });
      } else if (role === 'TEACHER') {
        await addTeacher({
          userId: res.user.id,
          name,
          email,
          phone,
          qualification: qualification || 'B.Sc / NCE',
          assignedSection: section,
          assignedClasses: [classLevel],
        });
      }

      router.push('/dashboard');
    } else {
      setError(res.message || 'Registration failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden" aria-hidden="true">
        <Watermark opacity={0.06} size={500} />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10 px-4">
        <Link href="/" className="inline-block mb-3">
          <Logo size={60} />
        </Link>
        <h2 className="text-2xl sm:text-3xl font-serif font-black text-white tracking-tight">
          Create Portal Account
        </h2>
        <p className="mt-1 text-sm text-amber-300">
          Enroll into Glorious King Academy and College in real-time.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4 sm:px-0">
        <div className="bg-slate-800/90 backdrop-blur-md py-8 px-6 shadow-2xl rounded-2xl border border-blue-800/50 sm:px-10">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-800/50 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Role Tabs */}
          <div className="grid grid-cols-3 gap-2 mb-6 p-1 bg-slate-900/90 rounded-xl border border-slate-700">
            <button
              type="button"
              onClick={() => setRole('STUDENT')}
              className={`py-2 px-2 text-xs font-bold rounded-lg transition-all flex flex-col items-center gap-1 ${
                role === 'STUDENT'
                  ? 'bg-amber-400 text-blue-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Student / Pupil</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('TEACHER')}
              className={`py-2 px-2 text-xs font-bold rounded-lg transition-all flex flex-col items-center gap-1 ${
                role === 'TEACHER'
                  ? 'bg-amber-400 text-blue-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Teacher / Staff</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('ADMIN')}
              className={`py-2 px-2 text-xs font-bold rounded-lg transition-all flex flex-col items-center gap-1 ${
                role === 'ADMIN'
                  ? 'bg-amber-400 text-blue-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Administrator</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="e.g. Emmanuel Adeyemi"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="e.g. user@gmail.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="e.g. 08012345678"
                />
              </div>
            </div>

            {/* Student specific fields */}
            {role === 'STUDENT' && (
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-900/50 rounded-xl border border-slate-700">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Academic Section
                  </label>
                  <select
                    value={section}
                    onChange={(e) => {
                      const sec = e.target.value as 'PRIMARY' | 'SECONDARY';
                      setSection(sec);
                      setClassLevel(sec === 'PRIMARY' ? 'Basic 1' : 'JSS 1');
                    }}
                    className="w-full py-2 px-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs"
                  >
                    <option value="PRIMARY">Primary Wing</option>
                    <option value="SECONDARY">College Wing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Class Level
                  </label>
                  <select
                    value={classLevel}
                    onChange={(e) => setClassLevel(e.target.value)}
                    className="w-full py-2 px-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs"
                  >
                    {(section === 'PRIMARY' ? PRIMARY_CLASSES : ALL_CLASSES.filter(c => !PRIMARY_CLASSES.includes(c))).map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Class Arm
                  </label>
                  <select
                    value={arm}
                    onChange={(e) => setArm(e.target.value)}
                    className="w-full py-2 px-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs"
                  >
                    {CLASS_ARMS.map(a => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Teacher specific fields */}
            {role === 'TEACHER' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Academic Qualification
                </label>
                <input
                  type="text"
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  className="block w-full py-2.5 px-3 bg-slate-900/80 border border-slate-700 rounded-xl text-white text-sm"
                  placeholder="e.g. B.Sc (Ed) Mathematics / NCE"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Create a secure password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-blue-950 bg-amber-400 hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all shadow-lg shadow-amber-400/20 disabled:opacity-50 cursor-pointer"
            >
              <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-700/60 text-center space-y-3">
            <p className="text-xs text-slate-400">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-bold text-amber-400 hover:text-amber-300 underline underline-offset-2 transition-colors ml-1"
              >
                Sign In to Portal &rarr;
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
