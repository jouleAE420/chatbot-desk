const { getDB } = require('../infrastructure/data/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const registerUser = async (userData) => {
  const { username, password, role } = userData;

  // Validate role
  const validRoles = ['technician', 'supervisor', 'admin'];
  if (!validRoles.includes(role)) {
    throw new Error('Rol inválido especificado');
  }

  const db = getDB();
  const usersCollection = db.collection('users');

  const existingUser = await usersCollection.findOne({ username: username });
  if (existingUser) {
    throw new Error('El usuario ya existe');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = {
    username: username,
    password: hashedPassword,
    role: role,
  };

  const result = await usersCollection.insertOne(newUser);
  return result;
};

const loginUser = async (loginData) => {
  const db = getDB();
  const usersCollection = db.collection('users');

  const user = await usersCollection.findOne({ username: loginData.username });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(loginData.password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const payload = {
    user: {
      id: user._id,
      username: user.username,
      role: user.role,
    },
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

  return { token, user };
};

module.exports = {
  registerUser,
  loginUser,
};
