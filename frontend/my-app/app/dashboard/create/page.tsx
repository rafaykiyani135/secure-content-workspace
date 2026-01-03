'use client';

import { useState, FormEvent } from 'react';
import { articleApi } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Editor from '@/components/Editor';

export default function CreateArticlePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED'>('DRAFT');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await articleApi.create({ title, content, status });
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Failed to create article', err);
      setError('Failed to create article. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <Link 
          href="/dashboard"
          className="text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        >
          ← Back to Articles
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
          Create New Article
        </h1>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2 block w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              placeholder="Article Title"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'DRAFT' | 'PUBLISHED')}
              className="mt-2 block w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Content
            </label>
            <div className="prose-editor">
              <Editor value={content} onChange={setContent} />
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Link
              href="/dashboard"
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              {isLoading ? 'Creating...' : 'Create Article'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
