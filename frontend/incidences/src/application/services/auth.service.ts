
interface LoginCredentials {
  username?: string;
  password?: string;
}

// Usar variables de entorno para la configuración
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const AUTH_API_URL = `${API_BASE_URL}/auth`;

// TEMPORAL: Login simulado para desarrollo sin backend
const USE_MOCK_LOGIN = import.meta.env.VITE_USE_MOCK_LOGIN === 'true';

const mockLogin = async (credentials: LoginCredentials) => {
  // Puedes personalizar los usuarios simulados aquí
  const users = [
    { username: 'admin', password: 'admin', role: 'admin' },
    { username: 'supervisor', password: 'supervisor', role: 'supervisor' },
    { username: 'tech', password: 'tech', role: 'technician' },
  ];
  const user = users.find(
    u => u.username === credentials.username && u.password === credentials.password
  );
  if (!user) {
    throw new Error('Credenciales inválidas (simulado)');
  }
  // Simula un token y datos de usuario
  return {
    token: 'mock-token',
    user: {
      id: 'mock-id',
      username: user.username,
      role: user.role,
    },
  };
};

interface RegisterCredentials extends LoginCredentials {
  role?: string;
  registrationKey?: string;
}

export const login = async (credentials: LoginCredentials) => {
  if (USE_MOCK_LOGIN) {
    return mockLogin(credentials);
  }
  try {
    const response = await fetch(`${AUTH_API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      try {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error en el login: ${response.statusText}`);
      } catch (jsonError) {
        throw new Error(`Error en el login: ${response.status} ${response.statusText}`);
      }
    }
    return response.json(); // Returns { token, user }
  } catch (error) {
    // Captura errores de red u otros problemas con fetch
    throw new Error(error instanceof Error ? error.message : 'No se pudo conectar al servidor.');
  }
};

export const register = async (credentials: RegisterCredentials) => {
  try {
    const response = await fetch(`${AUTH_API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      try {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error en el registro: ${response.statusText}`);
      } catch (jsonError) {
        throw new Error(`Error en el registro: ${response.status} ${response.statusText}`);
      }
    }

    return response.json();
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'No se pudo conectar al servidor para el registro.');
  }
};
