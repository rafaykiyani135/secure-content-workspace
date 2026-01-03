const express = require('express');
const authController = require('../controllers/auth.controller');
const { registerSchema, loginSchema } = require('../validations/auth.schema');
const { authenticate } = require('../middlewares/auth.middleware');

const router = express.Router();

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

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.get('/me', authenticate, authController.getMe);
router.post('/logout', authController.logout);

module.exports = router;
