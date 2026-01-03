const authService = require('../services/auth.service');

const register = async (req, res, next) => {
  try {
    const { user, token } = await authService.register(req.body);
    sendTokenResponse(user, token, res, 201);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { user, token } = await authService.login(req.body);
    sendTokenResponse(user, token, res, 200);
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Not authenticated' });
  }
};

const logout = (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};

// Helper to set cookie
const sendTokenResponse = (user, token, res, statusCode) => {
  const options = {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  };

  res.status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      data: { user } // Token removed from body
    });
};

module.exports = {
  register,
  login,
  getMe,
  logout
};
