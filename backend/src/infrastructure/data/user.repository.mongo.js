const { getDB } = require('./db');

const findUserByUsername = async (username) => {
  const db = getDB();
  return await db.collection('users').findOne({ username });
};

const createUser = async (userToInsert) => {
  const db = getDB();
  return await db.collection('users').insertOne(userToInsert);
};

module.exports = {
  findUserByUsername,
  createUser,
};
