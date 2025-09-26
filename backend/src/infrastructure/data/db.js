const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

let db;

const connectDB = async () => {
  if (db) return db;
  try {
    await client.connect();
    db = client.db(); // If your DB name is in the URI, this is enough.
    console.log('Conectado a MongoDB');
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
