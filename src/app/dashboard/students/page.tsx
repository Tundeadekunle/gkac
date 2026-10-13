'use client';

import React, { useState } from 'react';
import { useAcademic } from '@/context/AcademicContext';
import { Student } from '@/types';
import {
  Users,
  Search,
  Plus,
  Filter,
  UserCheck,
  CheckCircle2,
  X,
  Phone,
  Mail,
  ShieldCheck
} from 'lucide-react';
import { ALL_CLASSES, CLASS_ARMS, PRIMARY_CLASSES } from '@/lib/constants';

export default function StudentsPage() {
  const { students, addStudent } = useAcademic();
  const [sectionFilter, setSectionFilter] = useState<string>('ALL');
  const [classFilter, setClassFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [otherName, setOtherName] = useState('');
  const [gender, setGender] = useState<'MALE' | 'FEMALE'>('MALE');
  const [section, setSection] = useState<'PRIMARY' | 'SECONDARY'>('PRIMARY');
  const [classLevel, setClassLevel] = useState('Basic 1');
  const [arm, setArm] = useState('Gold');
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [guardianEmail, setGuardianEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const filteredStudents = students.filter(s => {
    const matchSection = sectionFilter === 'ALL' || s.section === sectionFilter;
    const matchClass = classFilter === 'ALL' || s.classLevel === classFilter;
    const search = searchTerm.toLowerCase();
    const matchSearch =
      !searchTerm ||
      s.firstName.toLowerCase().includes(search) ||
      s.lastName.toLowerCase().includes(search) ||
      s.admissionNo.toLowerCase().includes(search);
    return matchSection && matchClass && matchSearch;
  });

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await addStudent({
      firstName,
      lastName,
      otherName,
      gender,
      section,
      classLevel,
      arm,
      guardianName,
      guardianPhone,
      guardianEmail,
    });
    setSubmitting(false);
    setShowAddModal(false);
    // Reset form
    setFirstName('');
    setLastName('');
    setOtherName('');
    setGuardianName('');
    setGuardianPhone('');
    setGuardianEmail('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-black text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-amber-400" />
            Pupils &amp; Students Directory
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage enrollment for both Primary and College wings with auto-generated admission numbers.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-blue-950 font-bold text-xs shadow-md shadow-amber-400/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Student</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex flex-col md:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student name or admission number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Section Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={sectionFilter}
            onChange={(e) => setSectionFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs"
          >
            <option value="ALL">All Sections</option>
            <option value="PRIMARY">Primary Wing</option>
            <option value="SECONDARY">College Wing</option>
          </select>

          {/* Class Filter */}
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs"
          >
            <option value="ALL">All Classes</option>
            {ALL_CLASSES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B1A36] text-slate-300 uppercase tracking-wider font-semibold border-b border-blue-900/50">
              <tr>
                <th className="py-3.5 px-4">Student Name</th>
                <th className="py-3.5 px-4">Admission No</th>
                <th className="py-3.5 px-4">Wing</th>
                <th className="py-3.5 px-4">Class Level</th>
                <th className="py-3.5 px-4">Arm</th>
                <th className="py-3.5 px-4">Guardian Contact</th>
                <th className="py-3.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No students found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-750 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">
                        {s.firstName} {s.lastName} {s.otherName || ''}
                      </div>
                      <div className="text-[10px] text-slate-400">Gender: {s.gender}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-amber-300">
                      {s.admissionNo}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        s.section === 'PRIMARY'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-blue-950 text-blue-300 border border-blue-800'
                      }`}>
                        {s.section === 'PRIMARY' ? 'Primary' : 'College'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-200">{s.classLevel}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-200">{s.arm}</td>
                    <td className="py-3.5 px-4 text-slate-300">
                      <div>{s.guardianName || 'N/A'}</div>
                      <div className="text-[10px] text-slate-400">{s.guardianPhone || s.guardianEmail || ''}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold">
                        <CheckCircle2 className="w-3 h-3" /> Active
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-700">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-400" />
                Register New Pupil or Student
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
                    placeholder="e.g. Emmanuel"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
                    placeholder="e.g. Adeyemi"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Other Name</label>
                  <input
                    type="text"
                    value={otherName}
                    onChange={(e) => setOtherName(e.target.value)}
                    className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
                    placeholder="e.g. Oluwaseun"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Gender *</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'MALE' | 'FEMALE')}
                    className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 p-3 bg-slate-900/60 rounded-xl border border-slate-700">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Academic Section</label>
                  <select
                    value={section}
                    onChange={(e) => {
                      const sec = e.target.value as 'PRIMARY' | 'SECONDARY';
                      setSection(sec);
                      setClassLevel(sec === 'PRIMARY' ? 'Basic 1' : 'JSS 1');
                    }}
                    className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs"
                  >
                    <option value="PRIMARY">Primary Wing</option>
                    <option value="SECONDARY">College Wing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Class Level</label>
                  <select
                    value={classLevel}
                    onChange={(e) => setClassLevel(e.target.value)}
                    className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs"
                  >
                    {(section === 'PRIMARY' ? PRIMARY_CLASSES : ALL_CLASSES.filter(c => !PRIMARY_CLASSES.includes(c))).map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Arm</label>
                  <select
                    value={arm}
                    onChange={(e) => setArm(e.target.value)}
                    className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs"
                  >
                    {CLASS_ARMS.map(a => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-700">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Parent / Guardian Information
                </span>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Guardian Name</label>
                  <input
                    type="text"
                    value={guardianName}
                    onChange={(e) => setGuardianName(e.target.value)}
                    className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
                    placeholder="e.g. Dr. Michael Adeyemi"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Guardian Phone</label>
                    <input
                      type="tel"
                      value={guardianPhone}
                      onChange={(e) => setGuardianPhone(e.target.value)}
                      className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
                      placeholder="e.g. +234 803 111 2233"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Guardian Email</label>
                    <input
                      type="email"
                      value={guardianEmail}
                      onChange={(e) => setGuardianEmail(e.target.value)}
                      className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
                      placeholder="e.g. adeyemi@gmail.com"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-blue-950 font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  {submitting ? 'Registering...' : 'Register Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
