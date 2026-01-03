'use client';

import { useEffect, useState } from 'react';
import { articleApi, Article } from '@/lib/api';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';

export default function DashboardPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuthStore();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const data = await articleApi.getAll();
      // getAll returns { articles: [...], pagination: {...} } OR just array?
      // My api.ts getAll returns `response.data.data`.
      // The backend returns { success, message, data: { articles, pagination } }
      // The api.ts returns `response.data.data` which IS `{ articles, pagination }`.
      setArticles((data as any).articles || []);
    } catch (err) {
      console.error('Failed to load articles', err);
      setError('Failed to load articles');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      await articleApi.delete(id);
      setArticles(articles.filter(a => a.id !== id));
    } catch (err) {
      alert('Failed to delete article. You might not have permission.');
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
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Articles</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Manage your content here
          </p>
        </div>
        
        {user && (user.role === 'ADMIN' || user.role === 'EDITOR') && (
          <Link
            href="/dashboard/create"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Create Article
          </Link>
        )}
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {articles.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-700">
          <p className="text-slate-500 dark:text-slate-400">No articles found.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <div 
              key={article.id} 
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    article.status === 'PUBLISHED' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}>
                    {article.status}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {new Date(article.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <Link href={`/dashboard/article/${article.id}`} className="block group">
                  <h3 className="mt-4 text-lg font-semibold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                    {article.title}
                  </h3>
                </Link>
                
                <p className="mt-2 line-clamp-3 text-sm text-slate-600 dark:text-slate-400">
                  {article.content}
                </p>

                <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {article.author?.name || 'Unknown Author'}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-4 dark:border-slate-700">
                 {/* Only Owner or Admin can edit */}
                 {user && (user.role === 'ADMIN' || user.id === article.authorId) && (
                  <Link
                    href={`/dashboard/edit/${article.id}`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
                  >
                    Edit
                  </Link>
                 )}

                 {/* Only Admin can delete (per backend rules, though I might have relaxed it for owner in my head, backend code strict on ADMIN for delete? Let's check service logic: "Only admins can delete articles") */}
                 {user && user.role === 'ADMIN' && (
                  <button
                    onClick={() => handleDelete(article.id)}
                    className="text-sm font-medium text-red-600 hover:text-red-500 dark:text-red-400"
                  >
                    Delete
                  </button>
                 )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
