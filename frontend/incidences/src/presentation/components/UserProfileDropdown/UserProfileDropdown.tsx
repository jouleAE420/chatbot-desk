import React, { useState, useEffect, useRef } from 'react';
import { IconUserCircle, IconLogout } from '@tabler/icons-react';
import { useAuth } from '../../context/AuthContext';
import './UserProfileDropdown.css';


export const UserProfileDropdown = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!user) {
    return null;
  }

  return (
    <div className="user-profile-dropdown" ref={dropdownRef}>
      <IconUserCircle
        stroke={2}
        className="user-profile-icon"
        onClick={toggleDropdown}
      />
      {isOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-header">
            <strong>{user.username}</strong>
            <span>{user.email}</span>
            <span className="user-role">{user.role}</span>
          </div>
          <button onClick={logout} className="dropdown-item logout-button">
            <IconLogout stroke={2} />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
};