const articleService = require('../services/article.service');

const getAllArticles = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { status } = req.query;

    // Pass req.user to service for visibility filtering
    const result = await articleService.getAllArticles(page, limit, status, req.user);
    res.status(200).json({
      success: true,
      message: 'Articles retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getArticleById = async (req, res, next) => {
  try {
    const result = await articleService.getArticleById(req.params.id, req.user);
    res.status(200).json({
      success: true,
      message: 'Article retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const createArticle = async (req, res, next) => {
  try {
    const result = await articleService.createArticle(req.body, req.user.id);
    res.status(201).json({
      success: true,
      message: 'Article created successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateArticle = async (req, res, next) => {
  try {
    const result = await articleService.updateArticle(req.params.id, req.body, req.user);
    res.status(200).json({
      success: true,
      message: 'Article updated successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteArticle = async (req, res, next) => {
  try {
    const result = await articleService.deleteArticle(req.params.id, req.user);
    res.status(200).json({
      success: true,
      message: 'Article deleted successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
};
