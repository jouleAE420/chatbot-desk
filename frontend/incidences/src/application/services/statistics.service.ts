import type { TicketOptions } from '../../domain/models/incidencia';
import { StatusType } from '../../domain/models/incidencia';

// Type for chart data
export interface ChartData {
  name: string;
  value: number;
}

// Calculates the count of resolved incidences grouped by ticket type
export const calculateResolvedByType = (incidencias: TicketOptions[]): ChartData[] => {
  const resolved = incidencias.filter(inc => inc.status === StatusType.resolved);
  const byType = resolved.reduce((acc, inc) => {
    acc[inc.ticketType] = (acc[inc.ticketType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(byType).map(([name, value]) => ({ name, value }));
};

// Calculates the count of resolved incidences grouped by assignee
export const calculateResolvedByAssignee = (incidencias: TicketOptions[]): ChartData[] => {
  const resolved = incidencias.filter(inc => inc.status === StatusType.resolved && inc.assignedTo);
  const byAssignee = resolved.reduce((acc, inc) => {
    const assignee = inc.assignedTo!;
    acc[assignee] = (acc[assignee] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(byAssignee).map(([name, value]) => ({ name, value }));
};

// Calculates the number of incidences resolved in the last 7 days
export const calculateResolvedInLastWeek = (incidencias: TicketOptions[]): number => {
  const oneWeekAgo = new Date().setDate(new Date().getDate() - 7);
  const resolvedLastWeek = incidencias.filter(inc =>
    inc.status === StatusType.resolved &&
    inc.resolvedAt &&
    inc.resolvedAt >= oneWeekAgo
  );
  return resolvedLastWeek.length;
};

// Calculates the count of incidences grouped by ticket type
export const calculateIncidencesByType = (incidencias: TicketOptions[]): ChartData[] => {
  const byType = incidencias.reduce((acc, inc) => {
    acc[inc.ticketType] = (acc[inc.ticketType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(byType).map(([name, value]) => ({ name, value }));
};

// Calculates the count of incidences grouped by assignee
export const calculateIncidencesByAssignee = (incidencias: TicketOptions[]): ChartData[] => {
  const withAssignee = incidencias.filter(inc => inc.assignedTo);
  const byAssignee = withAssignee.reduce((acc, inc) => {
    const assignee = inc.assignedTo!;
    acc[assignee] = (acc[assignee] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(byAssignee).map(([name, value]) => ({ name, value }));
};

// Calculates the count of incidences grouped by status
export const calculateIncidencesByStatus = (incidencias: TicketOptions[]): ChartData[] => {
  const byStatus = incidencias.reduce((acc, inc) => {
    acc[inc.status] = (acc[inc.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(byStatus).map(([name, value]) => ({ name, value }));
};
