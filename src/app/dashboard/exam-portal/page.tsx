'use client';

import React, { useState, useEffect } from 'react';
import { useAcademic } from '@/context/AcademicContext';
import { useAuth } from '@/context/AuthContext';
import { Exam, Question } from '@/types';
import {
  Monitor,
  Plus,
  Clock,
  Play,
  CheckCircle2,
  XCircle,
  HelpCircle,
  X,
  Award,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { ALL_CLASSES, PRIMARY_CLASSES } from '@/lib/constants';

export default function ExamPortalPage() {
  const { user } = useAuth();
  const { exams, addExam, submitExam } = useAcademic();
  const [activeTab, setActiveTab] = useState<'EXAMS' | 'CREATE'>('EXAMS');

  // Taking Exam State
  const [currentTakingExam, setCurrentTakingExam] = useState<Exam | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);

  // Create Exam Form
  const [title, setTitle] = useState('');
  const [section, setSection] = useState<'PRIMARY' | 'SECONDARY'>('PRIMARY');
  const [classLevel, setClassLevel] = useState('Basic 4');
  const [subject, setSubject] = useState('Mathematics');
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 'q_1',
      questionNumber: 1,
      questionText: 'What is 15 multiplied by 4?',
      optionA: '50',
      optionB: '60',
      optionC: '70',
      optionD: '45',
      correctAnswer: 'B',
      marks: 10
    },
    {
      id: 'q_2',
      questionNumber: 2,
      questionText: 'Which of the following is an even number?',
      optionA: '21',
      optionB: '35',
      optionC: '48',
      optionD: '59',
      correctAnswer: 'C',
      marks: 10
    }
  ]);
  const [submitting, setSubmitting] = useState(false);

  // Timer Effect
  useEffect(() => {
    if (!currentTakingExam || examSubmitted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentTakingExam, examSubmitted, timeLeft]);

  const handleStartExam = (exam: Exam) => {
    setCurrentTakingExam(exam);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setTimeLeft(exam.durationMinutes * 60);
    setExamSubmitted(false);
    setSubmissionResult(null);
  };

  const handleSelectAnswer = (questionId: string, opt: string) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: opt }));
  };

  const handleFinishExam = async () => {
    if (!currentTakingExam) return;
    setExamSubmitted(true);

    const sub = await submitExam({
      examId: currentTakingExam.id,
      studentId: user?.id || 'stu_1',
      studentName: user?.name || 'Student',
      admissionNo: user?.identifier || 'GKAC/PRI/2026/001',
      answers: selectedAnswers,
    });
    setSubmissionResult(sub);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Add Question to Creator
  const addQuestionItem = () => {
    const nextNum = questions.length + 1;
    setQuestions(prev => [
      ...prev,
      {
        id: `q_${Date.now()}`,
        questionNumber: nextNum,
        questionText: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctAnswer: 'A',
        marks: 5
      }
    ]);
  };

  const handleSaveCreatedExam = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const totalMarks = questions.reduce((acc, q) => acc + (Number(q.marks) || 0), 0);
    await addExam({
      title,
      section,
      classLevel,
      subject,
      durationMinutes,
      totalMarks,
      passPercentage: 50,
      questions,
      createdBy: user?.name || 'Teacher'
    });
    setSubmitting(false);
    setActiveTab('EXAMS');
    setTitle('');
  };

  // If in interactive exam session:
  if (currentTakingExam) {
    const q = currentTakingExam.questions[currentQuestionIndex];
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Exam Hall Header */}
        <div className="p-5 rounded-2xl bg-[#0B1A36] border border-blue-900/60 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
              CBT Testing Hall &bull; {currentTakingExam.classLevel}
            </span>
            <h1 className="text-xl font-bold text-white mt-0.5">{currentTakingExam.title}</h1>
            <div className="text-xs text-slate-400 mt-1">
              Subject: <span className="text-slate-200">{currentTakingExam.subject}</span> &bull; Total Marks: {currentTakingExam.totalMarks}
            </div>
          </div>

          {/* Countdown Clock */}
          {!examSubmitted && (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-mono font-bold shadow-lg ${
              timeLeft < 180
                ? 'bg-red-950/80 border-red-600 text-red-300 animate-pulse'
                : 'bg-blue-950/80 border-blue-700 text-amber-300'
            }`}>
              <Clock className="w-4 h-4" />
              <span>Time Left: {formatTimer(timeLeft)}</span>
            </div>
          )}
        </div>

        {/* Exam Content or Submission Result */}
        {examSubmitted && submissionResult ? (
          <div className="p-8 rounded-2xl bg-slate-800 border border-slate-700 shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-400/20 text-amber-300 mx-auto flex items-center justify-center border border-amber-400/30">
              <Award className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white">Assessment Completed!</h2>
            <p className="text-slate-300 text-sm">
              Your test has been successfully submitted and scored in real time.
            </p>

            <div className="max-w-xs mx-auto p-4 rounded-xl bg-slate-900/80 border border-slate-700 space-y-2">
              <div className="text-xs text-slate-400">Your Score:</div>
              <div className="text-4xl font-black text-amber-400">
                {submissionResult.score} / {submissionResult.totalMarks}
              </div>
              <div className="text-sm font-bold text-slate-200">
                {submissionResult.percentage.toFixed(1)}% &bull;{' '}
                <span className={submissionResult.passed ? 'text-emerald-400' : 'text-rose-400'}>
                  {submissionResult.passed ? 'PASSED' : 'NEEDS IMPROVEMENT'}
                </span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => setCurrentTakingExam(null)}
                className="px-6 py-2.5 rounded-xl bg-amber-400 text-blue-950 font-bold text-xs hover:bg-amber-300"
              >
                Return to CBT Exam Portal
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Question Card */}
            {q && (
              <div className="p-6 rounded-2xl bg-slate-800/90 border border-slate-700 shadow-xl space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                  <span className="text-xs font-bold text-amber-300">
                    Question {currentQuestionIndex + 1} of {currentTakingExam.questions.length}
                  </span>
                  <span className="text-xs text-slate-400">Marks: {q.marks}</span>
                </div>

                <div className="text-base sm:text-lg font-medium text-white leading-relaxed">
                  {q.questionText}
                </div>

                {/* Multiple Choice Options */}
                <div className="space-y-2.5">
                  {(['A', 'B', 'C', 'D'] as const).map(opt => {
                    const optText = (q as any)[`option${opt}`];
                    const isSelected = selectedAnswers[q.id] === opt;
                    return (
                      <button
                        key={opt}
                        onClick={() => handleSelectAnswer(q.id, opt)}
                        className={`w-full p-4 rounded-xl text-left text-xs font-semibold transition-all flex items-center gap-3 border ${
                          isSelected
                            ? 'bg-amber-400/20 border-amber-400 text-amber-200 shadow-md'
                            : 'bg-slate-900/60 border-slate-700/80 text-slate-300 hover:border-slate-500 hover:bg-slate-900'
                        }`}
                      >
                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                          isSelected ? 'bg-amber-400 text-blue-950' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {opt}
                        </span>
                        <span className="flex-1 text-sm">{optText}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                  <button
                    disabled={currentQuestionIndex === 0}
                    onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                    className="px-4 py-2 rounded-xl bg-slate-700 text-white text-xs font-semibold disabled:opacity-40"
                  >
                    &larr; Previous Question
                  </button>

                  {currentQuestionIndex < currentTakingExam.questions.length - 1 ? (
                    <button
                      onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                      className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
                    >
                      Next Question &rarr;
                    </button>
                  ) : (
                    <button
                      onClick={handleFinishExam}
                      className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-blue-950 font-bold text-xs shadow-lg shadow-amber-400/20"
                    >
                      Submit Assessment Now
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Question Palette / Navigator */}
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
              <span className="text-[11px] font-bold text-slate-400 block mb-2">Question Navigator:</span>
              <div className="flex flex-wrap gap-2">
                {currentTakingExam.questions.map((ques, idx) => {
                  const answered = Boolean(selectedAnswers[ques.id]);
                  const active = idx === currentQuestionIndex;
                  return (
                    <button
                      key={ques.id}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`w-9 h-9 rounded-xl font-mono text-xs font-bold transition-all ${
                        active
                          ? 'ring-2 ring-amber-400 bg-amber-400 text-blue-950'
                          : answered
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-900 border border-slate-700 text-slate-400'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-black text-white flex items-center gap-2">
            <Monitor className="w-6 h-6 text-indigo-400" />
            Computer-Based Test (CBT) Portal
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Conduct timed digital examinations with instant grading and automatic score synchronization.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('EXAMS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'EXAMS'
                ? 'bg-amber-400 text-blue-950 shadow-md'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Available Tests
          </button>
          <button
            onClick={() => setActiveTab('CREATE')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'CREATE'
                ? 'bg-amber-400 text-blue-950 shadow-md'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Build Exam</span>
          </button>
        </div>
      </div>

      {/* Available Exams Tab */}
      {activeTab === 'EXAMS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {exams.map(exam => (
            <div
              key={exam.id}
              className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/60 hover:border-indigo-500/50 transition-all shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                    {exam.section === 'PRIMARY' ? 'Primary Wing' : 'College Wing'}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-mono text-amber-300">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{exam.durationMinutes} Mins</span>
                  </div>
                </div>

                <h3 className="font-bold text-white text-base mb-1">{exam.title}</h3>
                <div className="text-xs text-slate-400 mb-3">
                  Subject: <span className="text-slate-200">{exam.subject}</span> &bull; Class:{' '}
                  <span className="text-cyan-300 font-semibold">{exam.classLevel}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/60 text-xs text-slate-300 space-y-1 mb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Questions:</span>
                    <span className="font-bold text-white">{exam.questions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Marks:</span>
                    <span className="font-bold text-white">{exam.totalMarks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Pass Mark:</span>
                    <span className="font-bold text-emerald-400">{exam.passPercentage}%</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleStartExam(exam)}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-blue-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start CBT Assessment</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Build Exam Tab */}
      {activeTab === 'CREATE' && (
        <form onSubmit={handleSaveCreatedExam} className="p-6 rounded-2xl bg-slate-800 border border-slate-700 space-y-6 max-w-3xl mx-auto shadow-2xl">
          <div className="pb-3 border-b border-slate-700">
            <h2 className="text-lg font-bold text-white">Assessment Metadata</h2>
            <p className="text-xs text-slate-400 mt-0.5">Configure target class, subject, and exam duration.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Exam Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
                placeholder="e.g. First Term Mathematics Test"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Subject *</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
                placeholder="e.g. Mathematics"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Class Level</label>
              <select
                value={classLevel}
                onChange={(e) => setClassLevel(e.target.value)}
                className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
              >
                {ALL_CLASSES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Duration (Minutes)</label>
              <input
                type="number"
                min={5}
                max={120}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
              />
            </div>
          </div>

          {/* Question List Builder */}
          <div className="space-y-4 pt-4 border-t border-slate-700">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Questions ({questions.length})</h3>
              <button
                type="button"
                onClick={addQuestionItem}
                className="px-3 py-1.5 rounded-lg bg-blue-900 text-blue-200 border border-blue-700 text-xs font-bold hover:bg-blue-800"
              >
                + Add Question
              </button>
            </div>

            {questions.map((q, qIndex) => (
              <div key={q.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-700 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                  <span>Question #{qIndex + 1}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Marks:</span>
                    <input
                      type="number"
                      value={q.marks}
                      onChange={(e) => {
                        const m = Number(e.target.value);
                        setQuestions(prev => prev.map((item, idx) => idx === qIndex ? { ...item, marks: m } : item));
                      }}
                      className="w-16 p-1 bg-slate-800 border border-slate-700 rounded text-center text-white"
                    />
                  </div>
                </div>

                <textarea
                  required
                  placeholder="Enter the question text here..."
                  value={q.questionText}
                  onChange={(e) => {
                    const txt = e.target.value;
                    setQuestions(prev => prev.map((item, idx) => idx === qIndex ? { ...item, questionText: txt } : item));
                  }}
                  className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs h-16"
                />

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {(['A', 'B', 'C', 'D'] as const).map(opt => (
                    <div key={opt} className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-400 w-4">{opt}:</span>
                      <input
                        type="text"
                        required
                        placeholder={`Option ${opt}`}
                        value={(q as any)[`option${opt}`]}
                        onChange={(e) => {
                          const val = e.target.value;
                          setQuestions(prev => prev.map((item, idx) => idx === qIndex ? { ...item, [`option${opt}`]: val } : item));
                        }}
                        className="flex-1 p-1.5 bg-slate-800 border border-slate-700 rounded text-white text-xs"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                  <span className="text-xs text-slate-400 font-semibold">Correct Answer:</span>
                  <select
                    value={q.correctAnswer}
                    onChange={(e) => {
                      const ans = e.target.value as any;
                      setQuestions(prev => prev.map((item, idx) => idx === qIndex ? { ...item, correctAnswer: ans } : item));
                    }}
                    className="p-1.5 bg-slate-800 border border-slate-700 rounded text-white text-xs font-bold text-amber-300"
                  >
                    <option value="A">Option A</option>
                    <option value="B">Option B</option>
                    <option value="C">Option C</option>
                    <option value="D">Option D</option>
                  </select>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-blue-950 font-bold text-xs shadow-lg transition-all cursor-pointer"
            >
              {submitting ? 'Publishing...' : 'Publish CBT Assessment'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
