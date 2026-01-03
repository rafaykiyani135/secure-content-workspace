const { verifyToken } = require('../utils/jwt');
const prisma = require('../config/prisma');

const authenticate = async (req, res, next) => {
  try {
    let token;

    // DEBUG: Log incoming cookies
    console.log('Incoming Cookies:', req.cookies);

    if (req.cookies.token) {
      console.log('Token found in cookie!');
      token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route',
      });
    }

    const decoded = verifyToken(token);
    console.log('Decoded User ID:', decoded.userId);

    // Verify user still exists in DB
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true, name: true },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};

const optionalAuthenticate = async (req, res, next) => {
  try {
    let token;
    
    // DEBUG: Optional Auth Logs
    if (req.cookies.token) console.log('Optional Auth: Cookie found');

    if (req.cookies.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next();
    }
    
    try {
      const decoded = verifyToken(token);
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, email: true, role: true, name: true },
      });

      if (user) {
        req.user = user;
      }
    } catch (err) {
      // Token invalid, ignore
    }
    
    next();
  } catch (error) {
    next();
  }
};

module.exports = { authenticate, optionalAuthenticate };
