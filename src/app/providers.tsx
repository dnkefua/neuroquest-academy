'use client';

import { ReactNode } from 'react';
import { StudentProvider } from '@/contexts/StudentContext';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <StudentProvider>
      {children}
    </StudentProvider>
  );
}
