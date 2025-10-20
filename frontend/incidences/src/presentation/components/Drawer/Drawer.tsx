import React from 'react';
import './Drawer.css';
import { useAuth } from '../../context/AuthContext';
import { UserProfileDropdown } from '../UserProfileDropdown/UserProfileDropdown';
import { IconUserPlus, IconLogout, IconX } from '@tabler/icons-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAddUserModal: () => void;
}

export const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, onOpenAddUserModal }) => {
  const { user, logout } = useAuth();

  const handleAddUserClick = () => {
    onOpenAddUserModal();
    onClose(); // Cierra el drawer al abrir el modal
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div className={`drawer-backdrop ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <div className={`drawer ${isOpen ? 'open' : ''}`}>
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
            <button onClick={handleAddUserClick}>
              <IconUserPlus stroke={2} size={24} />
              <span>Agregar Usuario</span>
            </button>
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
