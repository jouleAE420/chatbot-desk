require('dotenv').config();

let db;
let client;

const connectDB = async () => {
  // Si usamos mock data, no necesitamos conectar a MongoDB
  if (process.env.USE_MOCK_DB === 'true') {
    console.log('Database connection is disabled (using mock data).');
    return Promise.resolve();
  }

  // Solo importamos MongoDB si realmente lo vamos a usar
  const { MongoClient } = require('mongodb');
  const { seedDatabase } = require('./seed');
  
  const uri = process.env.MONGO_URI;
  
  if (!uri) {
    console.warn('MONGO_URI not defined. Using mock data instead.');
    return Promise.resolve();
  }

  try {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db();
    console.log('Conectado a MongoDB');
    
    // Seed de la base de datos si es necesario
    await seedDatabase(db);
  } catch (error) {
    console.error('Error conectando a MongoDB:', error);
    console.log('Falling back to mock data.');
  }
};

const getDB = () => {
  // Cuando usamos mock data, retornamos null
  if (process.env.USE_MOCK_DB === 'true' || !db) {
    return null;
  }
  return db;
};

module.exports = { connectDB, getDB };