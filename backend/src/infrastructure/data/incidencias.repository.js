const { TicketType, StatusType } = require('../../domain/incidencia.model');

let tickets = [
  { id: 1, phoneOrigin: '1234567891', clientName: 'Cliente A', rate: 5, comment: 'algo paso 1 ', ticketType: TicketType.complaint, parkingId: 'zitacuaro', createdAt: 1704067200000, status: StatusType.created, assignedTo: undefined, resolvedAt: null },
  { id: 2, phoneOrigin: '1234567892', clientName: 'Cliente B', rate: 4, comment: 'algo paso 2', ticketType: TicketType.suggestion, parkingId: 'zitacuaro', createdAt: 1704153600000, status: StatusType.in_progress, assignedTo: 'Responsable B', resolvedAt: null },
  { id: 3, phoneOrigin: '1234567893', clientName: 'Cliente C', rate: 3, comment: 'algo paso 3', ticketType: TicketType.other, parkingId: 'zitacuaro', createdAt: 1704240000000, status: StatusType.resolved, assignedTo: 'Responsable C', resolvedAt: 1704240000000 },
  { id: 4, phoneOrigin: '1234567894', clientName: 'Cliente D', rate: 5, comment: 'algo paso 4', ticketType: TicketType.complaint, parkingId: 'zitacuaro', createdAt: 1704326400000, status: StatusType.created, assignedTo: undefined, resolvedAt: null },
  { id: 5, phoneOrigin: '1234567895', clientName: 'Cliente E', rate: 4, comment: 'algo paso 5', ticketType: TicketType.suggestion, parkingId: 'zitacuaro', createdAt: 1704412800000, status: StatusType.in_progress, assignedTo: 'Responsable E', resolvedAt: null },
  { id: 6, phoneOrigin: '1234567896', clientName: 'Cliente F', rate: 3, comment: 'algo paso 6', ticketType: TicketType.other, parkingId: 'zitacuaro', createdAt: 1704499200000, status: StatusType.resolved, assignedTo: 'Responsable F', resolvedAt: 1704499200000 },  
  { id: 7, phoneOrigin: '1234567897', clientName: 'Cliente G', rate: 5, comment: 'algo paso 7', ticketType: TicketType.complaint, parkingId: 'zitacuaro', createdAt: Date.now(), status: StatusType.pending, assignedTo: 'Responsable G', resolvedAt: null }
];

const getAll = () => {
  return tickets;
};

const updateStatus = (id, newStatus, assignedTo) => {
  const ticketIndex = tickets.findIndex(ticket => ticket.id === parseInt(id));

  if (ticketIndex === -1) {
    return null;
  }

  tickets[ticketIndex].status = newStatus;
  tickets[ticketIndex].assignedTo = assignedTo;

  // Set or clear the resolvedAt date based on the new status
  if (newStatus === StatusType.resolved) {
    tickets[ticketIndex].resolvedAt = Date.now();
  } else {
    tickets[ticketIndex].resolvedAt = null;
  }

  return tickets[ticketIndex];
};

module.exports = {
  getAll,
  updateStatus,
};