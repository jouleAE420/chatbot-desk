const repository = require('../infrastructure/data/incidencias.repository');

const getIncidencias = () => {
  const todasLasIncidencias = repository.getAll();
  return todasLasIncidencias;
};

const updateIncidenciaStatus = (id, status) => {
  if (!status) {
    // La validación podría ser más compleja y pertenecer aquí
    throw new Error('El nuevo estado (status) es requerido');
  }

  const updatedIncidencia = repository.updateStatus(id, status);

  if (!updatedIncidencia) {
    return null;
  }

  return updatedIncidencia;
};

module.exports = {
  getIncidencias,
  updateIncidenciaStatus,
};