import type { TicketOptions } from '../../domain/models/incidencia';
import { StatusType } from '../../domain/models/incidencia';

const API_URL = 'http://localhost:3000/api/incidencias';

// Helper function to get headers with auth token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

export const getAllIncidencias = async (): Promise<TicketOptions[]> => {
  const response = await fetch(API_URL, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    if (response.status === 401) {
      console.error("Unauthorized access. Token might be invalid or expired.");
    }
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

export const updateIncidenciaStatus = async (id: number, status: StatusType, assignedTo?: string): Promise<TicketOptions> => {
  const response = await fetch(`${API_URL}/${id}/status`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status, assignedTo }),
  });
  if (!response.ok) {
    throw new Error('Failed to update incidencia status');
  }
  return response.json();
};