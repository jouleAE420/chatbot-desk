const repository = require('../infrastructure/data/incidencias.repository');

const getIncidencias = async (user) => {
  // La lógica de filtrado por rol se mantiene aquí, en la capa de aplicación.
  // El repositorio se encarga solo del acceso a datos.
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

  const todasLasIncidencias = await repository.getAll(query);
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

module.exports = {
  getIncidencias,
  updateIncidenciaStatus,
  saveIncidencia,
  saveOfflineIncidencias,
};