const { z } = require('zod');

const createArticleSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    content: z.string().min(10, 'Content must be at least 10 characters'),
    status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
  }),
});

const updateArticleSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters').optional(),
    content: z.string().min(10, 'Content must be at least 10 characters').optional(),
    status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
  }),
  params: z.object({
    id: z.string().uuid('Invalid article ID'),
  }),
});

module.exports = {
  createArticleSchema,
  updateArticleSchema,
};
