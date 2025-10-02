// Mock data
let mockIncidencias = [
  { _id: '1', title: 'Incidencia de prueba 1', status: 'created', assignedTo: null, createdAt: new Date() },
  { _id: '2', title: 'Incidencia de prueba 2', status: 'assigned', assignedTo: 'tech1', createdAt: new Date() },
];

const getAll = async (query = {}) => {
  // Simple filtering for mock
  if (query.$or) {
    return mockIncidencias.filter(inc => {
      return query.$or.some(cond => {
        if (cond.assignedTo) return inc.assignedTo === cond.assignedTo;
        if (cond.assignedTo === null) return inc.assignedTo === null;
        return false;
      });
    });
  }
  return mockIncidencias;
};

const updateStatus = async (id, newStatus, assignedTo) => {
  const incidencia = mockIncidencias.find(inc => inc._id === id);
  if (!incidencia) {
    return null;
  }
  incidencia.status = newStatus;
  incidencia.assignedTo = assignedTo;
  if (newStatus === 'resolved') {
    incidencia.resolvedAt = new Date();
  } else {
    incidencia.resolvedAt = null;
  }
  return incidencia;
};

const save = async (incidencia) => {
  const newIncidencia = { ...incidencia, _id: String(mockIncidencias.length + 1) };
  mockIncidencias.push(newIncidencia);
  return { insertedId: newIncidencia._id };
};

const saveMany = async (incidencias) => {
    const newIncidencias = incidencias.map((inc, i) => ({
        ...inc,
        _id: String(mockIncidencias.length + i + 1),
    }));
    mockIncidencias.push(...newIncidencias);
    return { insertedCount: newIncidencias.length };
};

module.exports = {
  getAll,
  updateStatus,
  save,
  saveMany,
};
