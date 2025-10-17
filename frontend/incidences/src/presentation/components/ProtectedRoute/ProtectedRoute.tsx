import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute: React.FC = () => {
const { isAuthenticated, loading } = useAuth();

  // Si estamos cargando la sesión, muestra un mensaje de espera
  if (loading) {
    return <div>Cargando sesión...</div>;
  }

  // Si NO está autenticado (y ya no estamos cargando), redirige a login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si todo está bien, renderiza la ruta solicitada
  return <Outlet />;
};

export default ProtectedRoute;