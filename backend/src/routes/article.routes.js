const express = require('express');
const articleController = require('../controllers/article.controller');
const { authenticate, optionalAuthenticate } = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');
const { createArticleSchema, updateArticleSchema } = require('../validations/article.schema');

const router = express.Router();

// ... (validate omitted, unchanged)

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: error.errors.map(e => ({ field: e.path.join('.'), message: e.message })),
    });
  }
};

// Public Routes (Optional Auth for visibility filtering)
router.get('/', optionalAuthenticate, articleController.getAllArticles);
router.get('/:id', optionalAuthenticate, articleController.getArticleById);

// Protected Routes
router.post(
  '/', 
  authenticate, 
  authorize('ADMIN', 'EDITOR'), 
  validate(createArticleSchema), 
  articleController.createArticle
);

router.put(
  '/:id', 
  authenticate, 
  authorize('ADMIN', 'EDITOR'), 
  validate(updateArticleSchema), 
  articleController.updateArticle
);

router.delete(
  '/:id', 
  authenticate, 
  authorize('ADMIN'), 
  articleController.deleteArticle
);

module.exports = router;
