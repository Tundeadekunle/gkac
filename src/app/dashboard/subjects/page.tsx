'use client';

import React, { useState } from 'react';
import { useAcademic } from '@/context/AcademicContext';
import { Section } from '@/types';
import {
  BookOpen,
  Plus,
  Search,
  X,
  CheckCircle2
} from 'lucide-react';

export default function SubjectsPage() {
  const { subjects, addSubject } = useAcademic();
  const [sectionFilter, setSectionFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [section, setSection] = useState<Section>('BOTH');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const filteredSubjects = subjects.filter(s => {
    const matchSection = sectionFilter === 'ALL' || s.section === sectionFilter || s.section === 'BOTH';
    const matchSearch =
      !searchTerm ||
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSection && matchSearch;
  });

  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await addSubject({
      name,
      code: code || name.substring(0, 3).toUpperCase(),
      section,
      description,
    });
    setSubmitting(false);
    setShowAddModal(false);
    setName('');
    setCode('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-black text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-amber-400" />
            Curriculum &amp; Subjects
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Standard educational subjects approved across Primary and College wings.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-blue-950 font-bold text-xs shadow-md shadow-amber-400/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Subject</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search subjects by name or course code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <select
          value={sectionFilter}
          onChange={(e) => setSectionFilter(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs w-full sm:w-auto"
        >
          <option value="ALL">All Wings</option>
          <option value="PRIMARY">Primary Wing</option>
          <option value="SECONDARY">College Wing</option>
          <option value="BOTH">Universal (Both)</option>
        </select>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSubjects.map((s) => (
          <div
            key={s.id}
            className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/60 hover:border-amber-500/50 transition-all shadow-md flex items-center justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-black text-amber-300 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-lg">
                  {s.code}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  s.section === 'PRIMARY'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : s.section === 'SECONDARY'
                    ? 'bg-blue-950 text-blue-300 border border-blue-800'
                    : 'bg-purple-950 text-purple-300 border border-purple-800'
                }`}>
                  {s.section === 'BOTH' ? 'Primary & College' : (s.section === 'PRIMARY' ? 'Primary' : 'College')}
                </span>
              </div>
              <h3 className="font-bold text-white text-sm mt-1">{s.name}</h3>
              {s.description && (
                <p className="text-[11px] text-slate-400 mt-1">{s.description}</p>
              )}
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-slate-400">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>

      {/* Add Subject Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-700">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-400" />
                Add New Subject
              </h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Subject Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
                  placeholder="e.g. Further Mathematics"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Subject Code</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs font-mono"
                  placeholder="e.g. FMT (defaults to first 3 letters)"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Section</label>
                <select
                  value={section}
                  onChange={(e) => setSection(e.target.value as Section)}
                  className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
                >
                  <option value="BOTH">Universal (Both Primary &amp; College)</option>
                  <option value="PRIMARY">Primary Wing Only</option>
                  <option value="SECONDARY">College Wing Only</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs h-20"
                  placeholder="Course outline or syllabus notes..."
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
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
                  {submitting ? 'Adding...' : 'Add Subject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
