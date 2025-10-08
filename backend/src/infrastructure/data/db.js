const { MongoClient } = require('mongodb');
require('dotenv').config();
const { seedDatabase } = require('./seed'); // Importar la función de seeding

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

let db;

const connectDB = async () => {
  console.log('Database connection is disabled (using mock data).');
  return Promise.resolve();
};

const getDB = () => {
  // When using mock data, there is no DB instance.
  return null;
};

module.exports = { connectDB, getDB };