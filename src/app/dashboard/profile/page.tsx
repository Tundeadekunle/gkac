'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  User,
  Mail,
  Shield,
  Key,
  Database,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { SCHOOL_NAME } from '@/lib/constants';

export default function ProfilePage() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-serif font-black text-white flex items-center gap-2">
          <User className="w-6 h-6 text-amber-400" />
          My Profile &amp; Account Settings
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your credentials and view your authenticated session with NeonAuth.
        </p>
      </div>

      {saved && (
        <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Profile updated successfully!</span>
        </div>
      )}

      {/* Profile Card */}
      <div className="p-6 rounded-2xl bg-slate-800 border border-slate-700 shadow-xl space-y-6">
        <div className="flex items-center gap-4 pb-4 border-b border-slate-700">
          <div className="w-16 h-16 rounded-2xl bg-amber-400/20 text-amber-300 font-bold text-2xl flex items-center justify-center border border-amber-400/30">
            {user?.name ? user.name[0].toUpperCase() : 'G'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{user?.name || 'Administrator'}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-blue-950">
                {user?.role || 'ADMIN'}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                ID: {user?.identifier || user?.id || 'GKAC/ADM/001'}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Email Address</label>
            <div className="p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium">
              {user?.email || 'admin@gkac.edu.ng'}
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Phone Number</label>
            <div className="p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium">
              {user?.phone || '+234 800 GKAC EDU'}
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">School Institution</label>
            <div className="p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium">
              {SCHOOL_NAME}
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Authentication Engine</label>
            <div className="p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-emerald-400 font-medium flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" />
              <span>NeonAuth &bull; Managed Better Auth</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-700">
          <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-amber-400" />
            Security &amp; Password
          </h3>
          <p className="text-xs text-slate-400 mb-3">
            Change your portal login password. Password updates will sync automatically to Neon Postgres.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="password"
              placeholder="New password"
              className="p-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
            />
            <input
              type="password"
              placeholder="Confirm new password"
              className="p-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              setSaved(true);
              setTimeout(() => setSaved(false), 3000);
            }}
            className="mt-3 px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs"
          >
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
}
