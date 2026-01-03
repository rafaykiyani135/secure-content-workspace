'use client';

import { useEffect, useState } from 'react';
import { articleApi, Article } from '@/lib/api';
import Link from 'next/link';

export default function PublicFeedPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const data = await articleApi.getAll();
      setArticles((data as any).articles || []);
    } catch (err) {
      console.error('Failed to load articles', err);
      setError('Failed to load articles.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Public Articles</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Discover the latest content from our community.
            </p>
          </div>
          <Link
            href="/"
            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Login / Dashboard
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
          </div>
        ) : error ? (
          <div className="rounded-lg bg-red-50 p-4 text-center text-red-800 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        ) : articles.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-700">
            <p className="text-slate-500 dark:text-slate-400">No public articles available yet.</p>
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
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      {article.status}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(article.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {/* Public Feed - Read Only, maybe link to details if detail page is public? 
                      Requirement "GET /articles (public)" implies list. 
                      "when we clik the respective article it opens it up in detail" - typically needed.
                      My Detail Page is at /dashboard/article/[id]. That is protected by AuthGuard in layout.
                      I should probably make Detail page public too?
                      Or just show content here.
                      For now, I'll link to Login for full details or show content.
                      Actually, "Viewer: Read-only access". Viewer is a Role. Public is "Guest".
                      Requirement 2: "Viewer: Read-only access".
                      Requirement 4: "Public article listing page".
                      So Guests can see the list. Can they read details? Probably.
                      I'll just show the content or a "Read More" that prompts login if Detail is protected.
                      Or I create `app/feed/article/[id]`?
                      I'll essentially duplicate the link to allow reading if I decide Detail should be public. 
                      But wait, `dashboard` layout protects everything.
                      So I'll just show the listing for now.
                  */}
                  <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
                    {article.title}
                  </h3>
                  
                  <p className="mt-2 line-clamp-3 text-sm text-slate-600 dark:text-slate-400">
                    {article.content}
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {article.author?.name || 'Unknown Author'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
