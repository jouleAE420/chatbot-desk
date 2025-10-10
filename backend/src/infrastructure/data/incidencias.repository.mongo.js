const { getDB } = require('./db');
const { ObjectId } = require('mongodb');

const getCollection = () => getDB().collection('incidencias');

const getAll = async (query = {}) => {
  return await getCollection().find(query).toArray();
};

const updateStatus = async (id, newStatus, assignedTo) => {
  if (!ObjectId.isValid(id)) {
    throw new Error('ID de incidencia no válido');
  }

  const updateDoc = {
    $set: {
      status: newStatus,
      assignedTo: assignedTo,
    },
  };

  if (newStatus === 'resolved') {
    updateDoc.$set.resolvedAt = new Date();
  } else {
    updateDoc.$set.resolvedAt = null;
  }

  const result = await getCollection().findOneAndUpdate(
    { _id: new ObjectId(id) },
    updateDoc,
    { returnDocument: 'after' }
  );

  return result;
};

const save = async (incidencia) => {
  return await getCollection().insertOne(incidencia);
};

const saveMany = async (incidencias) => {
  return await getCollection().insertMany(incidencias);
};

const updateRating = async (id, newRating, newComment) => {
  if (!ObjectId.isValid(id)) {
    throw new Error('ID de incidencia no válido');
  }

  const updateDoc = {
    $set: {
      rate: newRating,
      comment: newComment || null, // Opcional: actualizar comentario si se proporciona
    },
  };

  const result = await getCollection().findOneAndUpdate(
    { _id: new ObjectId(id) },
    updateDoc,
    { returnDocument: 'after' }
  );

  return result;
};


module.exports = {
  getAll,
  updateStatus,
  save,
  saveMany,
  updateRating
};