'use client';

import React, { useState } from 'react';
import { useAcademic } from '@/context/AcademicContext';
import {
  GraduationCap,
  Plus,
  Search,
  X,
  Mail,
  Phone,
  BookOpen,
  CheckCircle2
} from 'lucide-react';
import { ALL_CLASSES } from '@/lib/constants';

export default function TeachersPage() {
  const { teachers, addTeacher, subjects } = useAcademic();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [title, setTitle] = useState('');
  const [qualification, setQualification] = useState('');
  const [assignedSection, setAssignedSection] = useState<'PRIMARY' | 'SECONDARY' | 'BOTH'>('BOTH');
  const [selectedClasses, setSelectedClasses] = useState<string[]>(['Basic 4', 'JSS 1']);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['Mathematics']);
  const [submitting, setSubmitting] = useState(false);

  const filteredTeachers = teachers.filter(t => {
    const search = searchTerm.toLowerCase();
    return (
      !searchTerm ||
      t.name.toLowerCase().includes(search) ||
      t.staffId.toLowerCase().includes(search) ||
      t.email.toLowerCase().includes(search)
    );
  });

  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await addTeacher({
      name,
      email,
      phone,
      title: title || 'Teacher',
      qualification: qualification || 'B.Sc / NCE',
      assignedSection,
      assignedClasses: selectedClasses,
      assignedSubjects: selectedSubjects,
    });
    setSubmitting(false);
    setShowAddModal(false);
    setName('');
    setEmail('');
    setPhone('');
    setTitle('');
    setQualification('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-black text-white flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-amber-400" />
            Teachers &amp; Staff Directory
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage instructors, academic qualifications, and class/subject allocations.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-blue-950 font-bold text-xs shadow-md shadow-amber-400/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Teacher</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search teacher by name, staff ID, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeachers.map((t) => (
          <div
            key={t.id}
            className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/60 hover:border-blue-500/50 transition-all shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-300 font-bold flex items-center justify-center border border-amber-400/20">
                    {t.name[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">{t.name}</h3>
                    <span className="text-[10px] text-amber-300 font-mono">{t.staffId}</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800">
                  {t.assignedSection}
                </span>
              </div>

              <div className="text-xs text-slate-300 space-y-1.5 mb-4">
                <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{t.email}</span>
                </div>
                {t.qualification && (
                  <div className="text-[11px] text-slate-400">
                    Qualification: <span className="text-slate-200">{t.qualification}</span>
                  </div>
                )}
              </div>

              {/* Assigned Classes */}
              <div className="mb-3">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                  Assigned Classes:
                </div>
                <div className="flex flex-wrap gap-1">
                  {t.assignedClasses.map(c => (
                    <span key={c} className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-[10px] text-cyan-300 font-medium">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Assigned Subjects */}
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                  Assigned Subjects:
                </div>
                <div className="flex flex-wrap gap-1">
                  {t.assignedSubjects.map(s => (
                    <span key={s} className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-[10px] text-amber-300 font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
              <span>Status</span>
              <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3 h-3" /> Active Staff
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Teacher Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-700">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-amber-400" />
                Add New Teacher
              </h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTeacher} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
                  placeholder="e.g. Mr. David Adebayo"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
                    placeholder="e.g. david.adebayo@gkac.edu.ng"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
                    placeholder="e.g. +234 803 555 1212"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Academic Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
                    placeholder="e.g. Head of Sciences"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Qualification</label>
                  <input
                    type="text"
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
                    placeholder="e.g. B.Sc (Ed) Mathematics"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Section</label>
                <select
                  value={assignedSection}
                  onChange={(e) => setAssignedSection(e.target.value as any)}
                  className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
                >
                  <option value="BOTH">Both Primary &amp; College</option>
                  <option value="PRIMARY">Primary Wing Only</option>
                  <option value="SECONDARY">College Wing Only</option>
                </select>
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
                  {submitting ? 'Adding...' : 'Add Teacher'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
