const { getDB } = require('../infrastructure/data/db');
const { ObjectId } = require('mongodb');

const getIncidencias = async (user) => {
  const db = getDB();
  const incidenciasCollection = db.collection('incidencias');

  let query = {};
  if (user.role === 'technician') {
    query = {
      $or: [
        { assignedTo: { $exists: false } }, // Unassigned
        { assignedTo: null }, // Unassigned
        { assignedTo: user.username } // Assigned to the current technician
      ]
    };
  }
  // For 'admin' and 'supervisor', the query is empty, so it fetches all.

  const todasLasIncidencias = await incidenciasCollection.find(query).toArray();
  return todasLasIncidencias;
};

const updateIncidenciaStatus = async (id, status, assignedTo) => {
  if (!status) {
    throw new Error('El nuevo estado (status) es requerido');
  }

  const db = getDB();
  const incidenciasCollection = db.collection('incidencias');

  // Ensure the ID is a valid ObjectId
  if (!ObjectId.isValid(id)) {
    throw new Error('ID de incidencia no válido');
  }

  const result = await incidenciasCollection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { status: status, assignedTo: assignedTo } },
    { returnDocument: 'after' }
  );

  return result; // The updated document
};

module.exports = {
  getIncidencias,
  updateIncidenciaStatus,
};