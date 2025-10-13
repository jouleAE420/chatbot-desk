import type { TicketOptions } from '../../domain/models/incidencia';
import { StatusType } from '../../domain/models/incidencia';

export interface ChartData {
  name: string;
  value: number;
  [key: string]: any; 
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

// calculateResolvedInLastWeek ha sido reemplazada por calculateIncidencesInTimeRange
// Si aún la tienes, puedes eliminarla.

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

// MODIFICADO: Ahora devuelve un número (horas promedio)
export const calculateAverageResolutionTime = (incidencias: TicketOptions[]): number => {
  const resolvedIncidences = incidencias.filter(
    (inc) => inc.status === StatusType.resolved && inc.resolvedAt && inc.createdAt
  );

  if (resolvedIncidences.length === 0) {
    return 0; // Devuelve 0 en lugar de 'N/A' para comparación numérica
  }

  const totalResolutionTime = resolvedIncidences.reduce((acc, inc) => {
    const resolutionTime = inc.resolvedAt! - inc.createdAt;
    return acc + resolutionTime;
  }, 0);

  const averageResolutionTimeInMs = totalResolutionTime / resolvedIncidences.length;

  // Convertir milisegundos a horas para comparación numérica
  const averageResolutionTimeInHours = averageResolutionTimeInMs / (1000 * 60 * 60);

  return parseFloat(averageResolutionTimeInHours.toFixed(1)); // Devuelve horas con un decimal
};

// NUEVO: Calcula el promedio de incidencias creadas en los últimos 7 días
export const calculateAverageCreatedLast7Days = (incidencias: TicketOptions[]): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalizar a inicio del día

  let totalCreatedLast7Days = 0;
  for (let i = 0; i < 7; i++) {
    const day = new Date(today);
    day.setDate(today.getDate() - i); // Restar días para obtener los últimos 7

    const createdOnDay = incidencias.filter(inc => {
      const createdAt = new Date(inc.createdAt);
      // Comparar solo la fecha (año, mes, día)
      return createdAt.getFullYear() === day.getFullYear() &&
             createdAt.getMonth() === day.getMonth() &&
             createdAt.getDate() === day.getDate();
    }).length;
    totalCreatedLast7Days += createdOnDay;
  }

  return totalCreatedLast7Days / 7;
};

export const calculateOpenIncidences = (incidencias: TicketOptions[]): number => {
  return incidencias.filter(
    (inc) =>
      inc.status === StatusType.created ||
      inc.status === StatusType.pending ||
      inc.status === StatusType.in_progress
  ).length;
};

export const calculateIncidencesCreatedToday = (incidencias: TicketOptions[]): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return incidencias.filter((inc) => {
    const createdAt = new Date(inc.createdAt);
    return createdAt >= today;
  }).length;
};

export const calculateIncidenceAging = (incidences: TicketOptions[]) => {
  const now = Date.now();
  const agingBuckets = {
    "Menos de 1 día": 0,
    "1-3 días": 0,
    "3-7 días": 0,
    "Más de 7 días": 0, // Asegúrate de que este sea el nombre exacto
  };
  incidences.forEach(inc => {
    // inc.createdAt es un timestamp en milisegundos
    const diffTime = now - inc.createdAt;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays < 1) {
      agingBuckets["Menos de 1 día"]++;
    } else if (diffDays <= 3) {
      agingBuckets["1-3 días"]++;
    } else if (diffDays <= 7) {
      agingBuckets["3-7 días"]++;
    } else {
      agingBuckets["Más de 7 días"]++; // ¡Aquí estaba el error!
    }
  });

  // Convertimos el objeto al formato de array que necesita la gráfica
  return Object.entries(agingBuckets).map(([name, value]) => ({ name, value }));
};

export const calculateAvgTimeByAssignee = (incidences: TicketOptions[]) => {
  const now = Date.now();

  // Paso 1: Agrupar todas las incidencias por responsable
  const incidentsByAssignee: { [key: string]: TicketOptions[] } = {};
  incidences.forEach(inc => {
    const assignee = inc.assignedTo || 'Sin Asignar'; // Usar "Sin Asignar" si no hay nadie
    if (!incidentsByAssignee[assignee]) {
      incidentsByAssignee[assignee] = [];
    }
    incidentsByAssignee[assignee].push(inc);
  });

  // Paso 2: Calcular el tiempo promedio para cada grupo de incidencias
  const avgTimeData = Object.entries(incidentsByAssignee).map(([assignee, tickets]) => {
    const totalAge = tickets.reduce((sum, ticket) => {
      const ageInMillis = now - ticket.createdAt;
      return sum + ageInMillis;
    }, 0);

    const avgAgeInMillis = tickets.length > 0 ? totalAge / tickets.length : 0;
    const avgAgeInDays = avgAgeInMillis / (1000 * 60 * 60 * 24);

    return {
      name: assignee,
      value: parseFloat(avgAgeInDays.toFixed(1)) // Devolvemos el promedio de días con 1 decimal
    };
  });

  return avgTimeData;
};

// MODIFICADO: Esta función es ahora genérica y reemplaza calculateResolvedInTimeRange
export const calculateIncidencesInTimeRange = (
  incidences: TicketOptions[],
  value: number,
  unit: 'days' | 'weeks' | 'months',
  timestampField: 'createdAt' | 'resolvedAt' // Nuevo argumento
) => {
  if (value <= 0) return 0;

  const now = Date.now();
  let cutoffTime = now;

  switch (unit) {
    case 'days':
      cutoffTime -= value * (1000 * 60 * 60 * 24);
      break;
    case 'weeks':
      cutoffTime -= value * 7 * (1000 * 60 * 60 * 24);
      break;
    case 'months':
      cutoffTime -= value * 30.44 * (1000 * 60 * 60 * 24);
      break;
    default:
      return 0;
  }

  return incidences.filter(inc => {
    const timestamp = inc[timestampField]; // Usamos el campo de fecha dinámicamente
    return timestamp && timestamp >= cutoffTime;
  }).length;
};