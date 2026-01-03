'use client';

import { useEffect, useState, FormEvent, use } from 'react';
import { articleApi, Article } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Editor from '@/components/Editor';

// Next.js 15+ params are async in some contexts, but let's stick to standard props for now or use `useParams`
// Actually, in App Router pages, params is a prop but might be a Promise in latest Next.js versions.
// Let's use `useParams` hook to be safe and cleaner.
import { useParams } from 'next/navigation';

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED'>('DRAFT');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      loadArticle(id);
    }
  }, [id]);

  const loadArticle = async (articleId: string) => {
    try {
      const article = await articleApi.getById(articleId);
      setTitle(article.title);
      setContent(article.content);
      setStatus(article.status);
    } catch (err) {
      console.error('Failed to load article', err);
      setError('Failed to load article details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsSaving(true);

    try {
      await articleApi.update(id, { title, content, status });
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Failed to update article', err);
      setError('Failed to update article. You might not have permission.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
      </div>
    );
  }

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
          Edit Article
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
              disabled={isSaving}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
