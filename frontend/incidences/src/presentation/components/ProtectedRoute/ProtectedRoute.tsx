import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

//este const define el componente ProtectedRoute
//el cual sirve para proteger las rutas que requieren autenticacion
//si el usuario no esta autenticado, lo redirige a la pagina de login
//si el usuario esta autenticado, renderiza las rutas hijas
const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

 //si el usuario es undefined, mostramos un mensaje de carga
  if (user === undefined) {
    return <div>Cargando...</div>; 
  }

  // si no esta autenticado, redirige a login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  //si esta autenticado, renderiza las rutas hijas
  return <Outlet />;
};

export default ProtectedRoute;
