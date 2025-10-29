
import type { TicketOptions } from '../../domain/models/incidencia';
import { StatusType } from '../../domain/models/incidencia';
import { mockIncidences } from '../../infrastructure/mock-data';

//const API_URL = 'http://localhost:3000/api/tickets';
const API_URL = `${import.meta.env.VITE_API_BASE_URL}/tickets`;

// --- MOCK API SWITCH ---
// Set VITE_USE_MOCK_API=true in your .env file to use mock data
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true';

// Helper function to get headers with auth token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

// --- MOCK IMPLEMENTATIONS ---

// A mutable copy for mock updates
let mutableMockIncidences = [...mockIncidences];

const getAllIncidenciasMock = async (page: number, limit: number): Promise<TicketOptions[]> => {
  console.log(`--- USING MOCK API: getAllIncidencias (page: ${page}, limit: ${limit}) ---`);
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Lógica de paginación
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedIncidences = mutableMockIncidences.slice(start, end);

  return Promise.resolve(paginatedIncidences);
};

const updateIncidenciaStatusMock = async (_id: string, status: StatusType): Promise<TicketOptions> => {
  console.log('--- USING MOCK API: updateIncidenciaStatus ---');
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const incidenceIndex = mutableMockIncidences.findIndex(inc => inc._id === _id);
  if (incidenceIndex === -1) {
    throw new Error('Mock Incidence not found');
  }

  const updatedIncidence = {
    ...mutableMockIncidences[incidenceIndex],
    status,
    resolvedAt: status === StatusType.resolved ? Date.now() : null,
  };

  mutableMockIncidences[incidenceIndex] = updatedIncidence;
  return Promise.resolve(updatedIncidence);
};


// --- REAL IMPLEMENTATIONS ---

const getAllIncidenciasReal = async (page: number, limit: number): Promise<TicketOptions[]> => {
  const response = await fetch(`${API_URL}?page=${page}&limit=${limit}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    if (response.status === 401) {
      console.error("Unauthorized access. Token might be invalid or expired. Logging out.");
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      throw new Error("Session expired. Please log in again.");
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

const updateIncidenciaStatusReal = async (_id: string, status: StatusType): Promise<TicketOptions> => {
  const response = await fetch(`${API_URL}/${_id}/status`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    if (response.status === 401) {
      console.error("Unauthorized access. Token might be invalid or expired. Logging out.");
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      throw new Error("Session expired. Please log in again.");
    }
    throw new Error('Failed to update incidencia status');
  }
  return response.json();
};

// --- EXPORTED FUNCTIONS ---
// These functions will use either the mock or real implementation based on the USE_MOCK_API flag.

export const getAllIncidencias = USE_MOCK_API ? getAllIncidenciasMock : getAllIncidenciasReal;
export const updateIncidenciaStatus = USE_MOCK_API ? updateIncidenciaStatusMock : updateIncidenciaStatusReal;
