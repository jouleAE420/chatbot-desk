const { getDB } = require('../infrastructure/data/db');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;
const bcrypt = require('bcryptjs');

const inMemoryUsers = [{
  _id: '654a93886f44d8b67cf902c6',
  username: 'admin',
  email: 'admin@example.com',
  password: bcrypt.hashSync('Admin1234', 10),
  role: 'admin',
}];

const registerUser = async (userData) => {
  const { username, email, password, role } = userData;

  const validRoles = ['operador', 'supervisor', 'admin'];
  if (!validRoles.includes(role)) {
    throw new Error('Rol inválido especificado');
  }

  const db = getDB();

  if (!db) {
    // Modo mock: verificar si el usuario ya existe
    const existingUser = inMemoryUsers.find(u => u.email === email);
    if (existingUser) {
      throw new Error('El usuario ya existe (en memoria)');
    }

    // Generar hash de la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear nuevo usuario con ID string para consistencia
    const newUser = {
      _id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      username: username,
      email: email,
      password: hashedPassword,
      role: role,
    };
    
    // Agregar al array en memoria
    inMemoryUsers.push(newUser);
    
    console.log('Usuario registrado en memoria:', { 
      id: newUser._id, 
      email: newUser.email, 
      role: newUser.role 
    });
    
    return { insertedId: newUser._id };
  }

  // Lógica de MongoDB
  const usersCollection = db.collection('users');
  const existingUserMongo = await usersCollection.findOne({ email: email });
  if (existingUserMongo) {
    throw new Error('El usuario ya existe');
  }
  const saltMongo = await bcrypt.genSalt(10);
  const hashedPasswordMongo = await bcrypt.hash(password, saltMongo);
  const newUserMongo = {
    username: username,
    email: email,
    password: hashedPasswordMongo,
    role: role,
  };
  const result = await usersCollection.insertOne(newUserMongo);
  return result;
};

const loginUser = async (loginData) => {
  const db = getDB();
  let user;

  if (!db) { 
    // Modo mock: buscar en memoria
    user = inMemoryUsers.find(u => u.email === loginData.email);
    
    if (!user) {
      console.log('Usuario no encontrado en memoria. Email buscado:', loginData.email);
      console.log('Usuarios en memoria:', inMemoryUsers.map(u => ({ email: u.email, role: u.role })));
      throw new Error('Credenciales inválidas');
    }
  } else {
    // Modo MongoDB
    const usersCollection = db.collection('users');
    user = await usersCollection.findOne({ email: loginData.email });
    
    if (!user) {
      throw new Error('Credenciales inválidas');
    }
  }
  

  // Verificar contraseña
  const isMatch = await bcrypt.compare(loginData.password, user.password);
  if (!isMatch) {
    console.log('Contraseña incorrecta para:', loginData.email);
    throw new Error('Credenciales inválidas');
  }
  
  // Crear token JWT
  const payload = {
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
  };
  
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
  
  console.log('Login exitoso:', { email: user.email, role: user.role });
  
  return { token, user };
};

module.exports = {
  registerUser,
  loginUser,
};