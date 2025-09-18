import type { TicketOptions } from '../../domain/models/incidencia';
import { StatusType } from '../../domain/models/incidencia';

const API_URL = 'http://localhost:3000/api/incidencias';

export const getAllIncidencias = async (): Promise<TicketOptions[]> => {
  const response = await fetch(API_URL);
  console.log(response);
  
   if (!response.ok) {
    const message = `Failed to fetch incidencias: ${response.status}`;
    throw new Error(message);
  }
  const data = await response.json();
  if (!Array.isArray(data)) {
    console.error("Data format is unexpected:", data);
    return [];
  }
  return data;
};

export const updateIncidenciaStatus = async (id: number, status: StatusType): Promise<TicketOptions> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    throw new Error('Failed to update incidencia status');
  }
  return response.json();
};