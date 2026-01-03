'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
// import { authApi } from '@/lib/api'; // Remove direct api import for auth actions
import { useAuthStore } from '@/lib/store';
import { useEffect } from 'react';

export default function Navbar() {
  const router = useRouter();
  // const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const { user, logout, checkAuth } = useAuthStore();

  useEffect(() => {
    // Sync store on mount
    checkAuth();
  }, [checkAuth]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <nav className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link 
            href="/dashboard" 
            className="text-xl font-bold tracking-tight text-slate-900 dark:text-white"
          >
            BxTrack
          </Link>
          <div className="hidden md:flex md:gap-6">
            <Link 
              href="/dashboard" 
              className="text-sm font-medium text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400"
            >
              Articles
            </Link>
            {/* Show Create link only for Admin/Editor */}
            {user && (user.role === 'ADMIN' || user.role === 'EDITOR') && (
              <Link 
                href="/dashboard/create" 
                className="text-sm font-medium text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400"
              >
                Create Article
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <div className="hidden text-sm text-slate-600 dark:text-slate-400 md:block">
              {user.name} <span className="text-xs uppercase opacity-75">({user.role})</span>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
}
