import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateAdmissionNumber(section: 'PRIMARY' | 'SECONDARY', seq: number = 1): string {
  const prefix = section === 'PRIMARY' ? 'GKAC/PRI' : 'GKAC/COL';
  const year = new Date().getFullYear();
  const padded = String(seq).padStart(3, '0');
  return `${prefix}/${year}/${padded}`;
}

export function generateStaffId(seq: number = 1): string {
  const year = new Date().getFullYear();
  const padded = String(seq).padStart(3, '0');
  return `GKAC/STF/${year}/${padded}`;
}
