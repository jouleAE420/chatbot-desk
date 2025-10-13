const { exec } = require('child_process');
const path = require('path');

let mockIncidencias;

const incidentsFilePath = path.join(__dirname, 'incidents.json');

function persistIncidents() {
  const jsonData = JSON.stringify(mockIncidencias, null, 2);
  const escapedJsonData = jsonData.replace(/\\/g, '\\').replace(/'/g, "'\\''");
  const command = `node "${path.join(__dirname, 'write-json.js')}" "${incidentsFilePath}" '${escapedJsonData}'`;

  exec(command, (error, stdout, stderr) => {
    if (error || stderr) {
      console.error(`Error persisting incidents: ${error || stderr}`);
    }
  });
}

try {
  mockIncidencias = require('./incidents.json');
  if (mockIncidencias.length === 0) {
    throw new Error('incidents.json is empty');
  }
} catch (error) {
  console.log('Could not load incidents from file, generating new ones.');
  const locations = ['zitacuaro', 'x', 'y', 'z', 'plaza bella', 'suburbia_mrl', 'dorada'];
  const ticketTypes = ['COMPLAINT', 'SUGGESTION', 'OTHER'];
  const statuses = ['CREATED', 'PENDING', 'IN_PROGRESS', 'RESOLVED'];
  const assignees = ['tech1', 'tech2', null];
mockIncidencias = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    title: `Incidencia de prueba ${i + 1}`,
    description: `Descripción de la incidencia ${i + 1}`,
    phoneOrigin: `555-123-${1000 + i}`,
    clientName: `Cliente ${i + 1}`,
    rate: null,
    comment: `Comentario de prueba ${i + 1}`,
    ticketType: ticketTypes[Math.floor(Math.random() * ticketTypes.length)],
    parkingId: locations[Math.floor(Math.random() * locations.length)],
    createdAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 7).getTime(),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    assignedTo: assignees[Math.floor(Math.random() * assignees.length)],
    resolvedAt: null,
  }));

  mockIncidencias.forEach(inc => {
    if (inc.status === 'RESOLVED') {
      if (!inc.assignedTo) inc.assignedTo = 'tech1';
      inc.resolvedAt = new Date(inc.createdAt + Math.random() * 1000 * 60 * 60 * 24).getTime();
      inc.rate = Math.floor(Math.random() * 5) + 1;
    } else {
      inc.resolvedAt = null;
    }
    if (inc.status === 'CREATED') {
      inc.assignedTo = null;
    }
    if ((inc.status === 'PENDING' || inc.status === 'IN_PROGRESS') && !inc.assignedTo) {
      inc.assignedTo = 'tech1';
    }
  });

  persistIncidents();
}

const getAll = async (query = {}) => {
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
  const incidencia = mockIncidencias.find(inc => inc.id === parseInt(id, 10));
  if (!incidencia) {
    return null;
  }
  incidencia.status = newStatus;
  incidencia.assignedTo = assignedTo;
  if (newStatus === 'RESOLVED') {
    incidencia.resolvedAt = new Date().getTime();
  } else {
    incidencia.resolvedAt = null;
  }
  persistIncidents();
  return incidencia;
};

const save = async (incidencia) => {
  const newIncidencia = { ...incidencia, id: mockIncidencias.length + 1 };
  mockIncidencias.push(newIncidencia);
  persistIncidents();
  return { insertedId: newIncidencia.id };
};

const saveMany = async (incidencias) => {
    const newIncidencias = incidencias.map((inc, i) => ({
        ...inc,
        id: mockIncidencias.length + i + 1,
    }));
    mockIncidencias.push(...newIncidencias);
    persistIncidents();
    return { insertedCount: newIncidencias.length };
};
const updateRating = async (id, newRating, newComment) => {
  const incidencia = mockIncidencias.find(inc => inc.id === parseInt(id, 10));
  if (!incidencia) {
    return null;
  }
  incidencia.rate = newRating;
  incidencia.comment = newComment || ''; 
  
  persistIncidents();
  return incidencia;
};


module.exports = {
  getAll,
  updateStatus,
  save,
  saveMany,
  updateRating,
};