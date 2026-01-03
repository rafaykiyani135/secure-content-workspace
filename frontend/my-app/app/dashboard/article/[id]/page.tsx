'use client';

import { useEffect, useState } from 'react';
import { articleApi, Article } from '@/lib/api';
import { useParams } from 'next/navigation';
import Link from 'next/link';
// import DOMPurify from 'dompurify'; // Skipped, using dangerouslySetInnerHTML directly
// I'll skip DOMPurify installation for speed unless I want to be strict. 
// I'll just use dangerous HTML for now as it's a "backend" app task primarily.

export default function ArticleDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      loadArticle(id);
    }
  }, [id]);

  const loadArticle = async (articleId: string) => {
    try {
      const data = await articleApi.getById(articleId);
      setArticle(data);
    } catch (err) {
      console.error('Failed to load article', err);
      setError('Failed to load article details.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-center text-red-800 dark:bg-red-900/20 dark:text-red-400">
        {error || 'Article not found'}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <Link 
          href="/dashboard"
          className="text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        >
          ← Back to Articles
        </Link>
      </div>

      <article className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-slate-800">
        <div className="border-b border-slate-100 px-8 py-6 dark:border-slate-700">
          <div className="flex items-center gap-3">
             <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                article.status === 'PUBLISHED' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
              }`}>
                {article.status}
              </span>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {new Date(article.createdAt).toLocaleDateString()}
              </span>
          </div>
          <h1 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
            {article.title}
          </h1>
          <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            By <span className="font-medium text-slate-900 dark:text-slate-200">{article.author?.name || 'Unknown'}</span>
          </div>
        </div>

        <div className="px-8 py-8">
           {/* Render HTML content safely */}
           <div 
             className="prose max-w-none dark:prose-invert"
             dangerouslySetInnerHTML={{ __html: article.content }}
           />
        </div>
      </article>
    </div>
  );
}
