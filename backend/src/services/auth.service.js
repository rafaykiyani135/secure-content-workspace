const bcrypt = require('bcrypt');
const prisma = require('../config/prisma');
const { generateToken } = require('../utils/jwt');

const register = async ({ email, password, name, role }) => {
  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    const error = new Error('User already exists');
    error.statusCode = 400;
    throw error;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: role || 'VIEWER',
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });

  // Generate token
  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return { user, token };
};

const login = async ({ email, password }) => {
  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  // Verify password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  // Generate token
  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  // Remove password from response
  const { password: _, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
};

module.exports = {
  register,
  login,
};
