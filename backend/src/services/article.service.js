const prisma = require('../config/prisma');

const getAllArticles = async (page = 1, limit = 10, status, user) => {
  const skip = (page - 1) * limit;
  let where = {};

  if (status) {
    where.status = status;
  }

  // Visibility Logic
  if (!user) {
    // Public: Published only
    where.status = 'PUBLISHED';
  } else if (user.role !== 'ADMIN') {
    // Editor/Viewer: Published OR Own
    // We combine this with any existing status filter using AND
    where = {
      AND: [
        where, // Keeps the status filter if provided
        {
          OR: [
            { status: 'PUBLISHED' },
            { authorId: user.id }
          ]
        }
      ]
    };
  }
  // Admin sees all matching 'status' filter (or all if none)

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      skip,
      take: limit,
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.article.count({ where }),
  ]);

  return {
    articles,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getArticleById = async (id, user) => {
  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      author: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  if (!article) {
    const error = new Error('Article not found');
    error.statusCode = 404;
    throw error;
  }

  // Check Visibility
  let isVisible = false;

  if (!user) {
    // Public
    if (article.status === 'PUBLISHED') isVisible = true;
  } else if (user.role === 'ADMIN') {
    isVisible = true;
  } else {
    // Editor/Viewer
    if (article.status === 'PUBLISHED' || article.authorId === user.id) {
      isVisible = true;
    }
  }

  if (!isVisible) {
    const error = new Error('You do not have permission to view this article');
    error.statusCode = 403;
    throw error;
  }

  return article;
};

const createArticle = async (data, authorId) => {
  return await prisma.article.create({
    data: {
      ...data,
      authorId,
    },
    include: {
      author: {
        select: { id: true, name: true },
      },
    },
  });
};

const updateArticle = async (id, data, user) => {
  const article = await prisma.article.findUnique({
    where: { id },
  });

  if (!article) {
    const error = new Error('Article not found');
    error.statusCode = 404;
    throw error;
  }

  // Check ownership (Admin can edit all, Editor can only edit own)
  if (user.role !== 'ADMIN' && article.authorId !== user.id) {
    const error = new Error('You can only edit your own articles');
    error.statusCode = 403;
    throw error;
  }

  return await prisma.article.update({
    where: { id },
    data,
    include: {
      author: {
        select: { id: true, name: true },
      },
    },
  });
};

const deleteArticle = async (id, user) => {
  const article = await prisma.article.findUnique({
    where: { id },
  });

  if (!article) {
    const error = new Error('Article not found');
    error.statusCode = 404;
    throw error;
  }

  // Admin only for deletion as per requirements
  // "DELETE /articles/:id (Admin only)"
  if (user.role !== 'ADMIN') {
    const error = new Error('Only admins can delete articles');
    error.statusCode = 403;
    throw error;
  }

  await prisma.article.delete({
    where: { id },
  });

  return { message: 'Article deleted successfully' };
};

module.exports = {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
};
