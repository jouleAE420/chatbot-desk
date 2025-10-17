
import { type TicketOptions, StatusType, TicketType } from '../domain/models/incidencia';

// Users for mock login
export const mockUsers = [
  { id: 'mock-id-admin', username: 'admin', email: 'admin@example.com', password: 'Admin1234', role: 'admin' },
  { id: 'mock-id-supervisor', username: 'supervisor', email: 'supervisor@example.com', password: 'Super123', role: 'supervisor' },
  { id: 'mock-id-operador', username: 'operador', email: 'operador@example.com', password: 'Operador12345', role: 'operador' },
];

// --- Dynamic Mock Incidence Generator ---

const locations = ['zitacuaro', 'x', 'y', 'z', 'plaza bella', 'suburbia_mrl', 'dorada'];
const ticketTypes = Object.values(TicketType);
const clientNames = ['Juan Pérez', 'Maria García', 'Carlos López', 'Ana Martinez', 'Luis Hernandez', 'Laura Gomez', 'Sergio Ramirez', 'Elena Torres'];
const comments = [
    'La barrera de entrada no se abre.',
    'El cajero no devuelve cambio.',
    'Deberían poner música ambiental.',
    'Perdí mi boleto, necesito ayuda.',
    'El estacionamiento está muy sucio.',
    'No hay lugares para discapacitados disponibles.',
    'El personal fue muy amable.',
    'Sugerencia: más botes de basura.'
];

const generateMockIncidences = (count: number): TicketOptions[] => {
  const incidents: TicketOptions[] = [];
  const now = Date.now();

  for (let i = 1; i <= count; i++) {
    incidents.push({
      id: i,
      phoneOrigin: `555-01${String(i).padStart(2, '0')}`,
      clientName: clientNames[Math.floor(Math.random() * clientNames.length)],
      rate: null, // Always null for 'CREATED' status
      comment: `Incidencia ${i}: ${comments[Math.floor(Math.random() * comments.length)]}`,
      ticketType: ticketTypes[Math.floor(Math.random() * ticketTypes.length)],
      parkingId: locations[Math.floor(Math.random() * locations.length)],
      createdAt: now - (Math.floor(Math.random() * 15) * 1000 * 60 * 60 * 24), // Randomly within last 15 days
      status: StatusType.created, // Always 'CREATED'
      assignedTo: undefined, // Always unassigned for 'CREATED' status
      resolvedAt: null, // Always null for 'CREATED' status
    });
  }
  return incidents;
};

export const mockIncidences: TicketOptions[] = generateMockIncidences(30);
