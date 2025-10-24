import React, { useState, useEffect } from 'react';
import './Drawer.css';
import { useAuth } from '../../context/AuthContext';
import { UserProfileDropdown } from '../UserProfileDropdown/UserProfileDropdown';
// 1. Importa el nuevo ícono
import { IconUserPlus, IconLogout, IconX, IconUserSearch } from '@tabler/icons-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAddUserModal: () => void;
  onOpenSearchOperatorModal: () => void; // 2. Añade la nueva prop
}

export const Drawer: React.FC<DrawerProps> = ({ 
  isOpen, 
  onClose, 
  onOpenAddUserModal,
  onOpenSearchOperatorModal // 3. Recibe la nueva prop
}) => {
  const { user, logout } = useAuth();
  const [isMounted, setIsMounted] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      const timer = setTimeout(() => setIsAnimating(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setIsMounted(false), 400);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleAddUserClick = () => {
    onOpenAddUserModal();
    onClose(); 
  };

  // 4. Nueva función para manejar el clic en el botón de búsqueda
  const handleSearchOperatorClick = () => {
    onOpenSearchOperatorModal();
    onClose();
  };

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <div className={`drawer-backdrop ${isAnimating ? 'open' : ''}`} onClick={onClose} />
      <div className={`drawer ${isAnimating ? 'open' : ''}`}>
        <div className="drawer-header">
          <button onClick={onClose} className="glass-icon-button">
            <IconX size={24} />
          </button>
        </div>
        <div className="drawer-content">
          <div className="user-profile-wrapper">
            <UserProfileDropdown />
          </div>

          {user && user.role === 'admin' && (
            <>
              <button onClick={handleAddUserClick}>
                <IconUserPlus stroke={2} size={24} />
                <span>Agregar Usuario</span>
              </button>
              {/* 5. El nuevo botón de búsqueda */}
              <button onClick={handleSearchOperatorClick}>
                <IconUserSearch stroke={2} size={24} />
                <span>Buscar Operador</span>
              </button>
            </>
          )}

          {user && (
            <button onClick={logout}>
              <IconLogout size={24} />
              <span>Cerrar Sesión</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
};