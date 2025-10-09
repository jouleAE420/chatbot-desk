const { getDB } = require('./db');

const findUserByEmail = async (email) => {
  const db = getDB();
  return await db.collection('users').findOne({ email });
};

const createUser = async (userToInsert) => {
  const db = getDB();
  return await db.collection('users').insertOne(userToInsert);
};

const findAllUsers = async () => {
  const db = getDB();
  // Usamos 'projection' para excluir el campo de la contraseña de los resultados
  return await db.collection('users').find({}, { projection: { password: 0 } }).toArray();
};

module.exports = {
  findUserByEmail,
  createUser,
  findAllUsers,
};
