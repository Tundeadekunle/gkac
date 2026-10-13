import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { AcademicProvider } from '@/context/AcademicContext';
import { SCHOOL_NAME, SCHOOL_MOTTO } from '@/lib/constants';

export const metadata: Metadata = {
  title: `${SCHOOL_NAME} | Excellence in Primary & College Education`,
  description: `Official portal for ${SCHOOL_NAME} - Student Registration, Attendance Tracking, Continuous Assessment (CA) & Exam Results, CBT Exam Portal, and Downloadable Terminal Reports.`,
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col antialiased bg-slate-50 text-slate-900">
        <AuthProvider>
          <AcademicProvider>
            {children}
          </AcademicProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
