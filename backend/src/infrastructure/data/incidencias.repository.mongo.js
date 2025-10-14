const { getDB } = require('./db');
const { ObjectId } = require('mongodb');

const getCollection = () => getDB().collection('incidencias');

const getAll = async (query = {}, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return await getCollection()
    .find(query)
    .sort({ createdAt: -1 }) // Ordenar por fecha de creación descendente
    .skip(skip)
    .limit(limit)
    .toArray();
};

const updateStatus = async (id, newStatus, assignedTo) => {
// ... (código de updateStatus existente) ...
};

const save = async (incidencia) => {
  return await getCollection().insertOne(incidencia);
};

const saveMany = async (incidencias) => {
  return await getCollection().insertMany(incidencias);
};

// NUEVA FUNCIÓN: Actualiza la calificación
const updateRating = async (id, newRating, newComment) => {
  if (!ObjectId.isValid(id)) {
    // Si usas mock data, el ID no será un ObjectId, maneja solo si MONGO_URI está definido
    if (process.env.MONGO_URI) { 
        throw new Error('ID de incidencia no válido');
    }
  }

  const updateDoc = {
    $set: {
      rate: newRating,
      comment: newComment || null, // Permite actualizar también el comentario si viene
    },
  };
  
  // Usamos el ID directamente si no es un ObjectId (para mock)
  const query = process.env.MONGO_URI ? { _id: new ObjectId(id) } : { id: parseInt(id, 10) };

  const result = await getCollection().findOneAndUpdate(
    query,
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
  updateRating // <--- EXPORTAR LA NUEVA FUNCIÓN
};