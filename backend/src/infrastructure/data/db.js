const { MongoClient } = require('mongodb');
require('dotenv').config();
const { seedDatabase } = require('./seed'); // Importar la función de seeding

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

let db;

const connectDB = async () => {
  if (db) return db;
  try {
    await client.connect();
    db = client.db(); // Si el nombre de tu BD está en la URI, esto es suficiente.
    console.log('Conectado a MongoDB');
    await seedDatabase(db); // Pasamos la instancia de la base de datos directamente
    return db;
  } catch (e) {
    console.error('No se pudo conectar a MongoDB', e);
    process.exit(1);
  }
};

const getDB = () => {
  if (!db) {
    throw new Error('La base de datos no está inicializada. Llama a connectDB primero.');
  }
  return db;
};

module.exports = { connectDB, getDB };
