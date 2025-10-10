const repository = require('../infrastructure/data/incidencias.repository');

const getIncidencias = async (user) => {
  // Now all roles can see all incidents.
  const todasLasIncidencias = await repository.getAll({});
  return todasLasIncidencias;
};

const updateIncidenciaStatus = async (id, status, assignedTo) => {
  if (!status) {
    throw new Error('El nuevo estado (status) es requerido');
  }
  return await repository.updateStatus(id, status, assignedTo);
};

const saveIncidencia = async (incidenciaData) => {
  const newIncidencia = {
    ...incidenciaData,
    createdAt: new Date(),
    status: 'created', // Estado inicial por defecto
  };
  return await repository.save(newIncidencia);
};

const saveOfflineIncidencias = async (incidencias) => {
  const incidenciasConFecha = incidencias.map(inc => ({
    ...inc,
    createdAt: new Date(),
    status: 'created',
  }));
  return await repository.saveMany(incidenciasConFecha);
};
const updateIncidenciaRating = async (id, rating, comment) => {
  if (!rating) {
    throw new Error('La calificación (rating) es requerida');
  }
  // En un entorno de producción, aquí verificaríamos que la calificación esté entre 1 y 5.
  // También deberíamos asegurar que la incidencia ya esté en estado 'RESOLVED'.
  return await repository.updateRating(id, rating, comment);
};

module.exports = {
  getIncidencias,
  updateIncidenciaStatus,
  saveIncidencia,
  saveOfflineIncidencias,
  updateIncidenciaRating, 
};