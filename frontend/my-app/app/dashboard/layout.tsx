'use client';

import Navbar from '@/components/Navbar';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { authApi } from '@/lib/api';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isInitialized, checkAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Only check auth if we haven't checked it yet in this session
    if (!isInitialized) {
      checkAuth();
    }
  }, [isInitialized, checkAuth]);

  useEffect(() => {
    // Redirect only once we are sure the auth check is done and failed
    if (isInitialized && !isAuthenticated) {
      router.push('/');
    }
  }, [isInitialized, isAuthenticated, router]);

  // Show loading while we are checking auth for the first time
  if (!isInitialized) {
     return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
