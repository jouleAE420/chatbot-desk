import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Header.css';
import CategoryToolbar from '../CategoryToolbar/CategoryToolbar';
import type { ColumnState } from '../../App.tsx';
import { StatusType } from '../../../domain/models/incidencia';
import { useAuth } from '../../context/AuthContext';
import {
  IconUserPlus,
  IconLogout,
  IconMenu2, // Se mantiene si se usa en desktop para el menú
  IconX, // Se puede quitar si no se usa
  IconMessageReport, // Se puede quitar si no se usa
  IconLoader2, // Se puede quitar si no se usa
  IconCircleCheck, // Se puede quitar si no se usa
} from '@tabler/icons-react';
import ViewSwitcher from '../ViewSwitcher/ViewSwitcher';
import { UserProfileDropdown } from '../UserProfileDropdown/UserProfileDropdown.tsx';
import AddUserModal from '../AddUserModal/AddUserModal';
import { register } from '../../../application/services/auth.service';

const statusKeyMap: { [key: string]: StatusType } = {
  created: StatusType.created,
  pending: StatusType.pending,
  'in-progress': StatusType.in_progress,
  resolved: StatusType.resolved,
};

interface HeaderProps {
  columnStates: Record<StatusType | 'all', ColumnState>;
  onFilterButtonClick: (status: StatusType | 'all') => void;
  onSortChange: (status: StatusType | 'all', sortOrder: 'asc' | 'desc') => void;
  onApplyFilter: (status: StatusType | 'all', filters: any) => void;
  onStatisticsClick?: (status: StatusType | 'all') => void;
}

const Header: React.FC<HeaderProps> = ({
  columnStates,
  onFilterButtonClick,
  onSortChange,
  onApplyFilter,
  onStatisticsClick,
}) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  // const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // ELIMINADO

  const canViewDashboards = user?.role === 'admin' || user?.role === 'supervisor';
  const isDashboardView = location.pathname.startsWith('/dashboard');

  const statusPageRegex = /^\/(created|pending|in-progress|resolved)$/;
  const isStatusPage = statusPageRegex.test(location.pathname);
  const isKanbanView = location.pathname === '/' || isStatusPage;

  const currentStatusKey = location.pathname.substring(1);
  const currentStatus = statusKeyMap[currentStatusKey];
  const handleAddUser = async (userData: { username: string; email: string; role: string; password: string }) => {
    try {
      await register(userData);
    } catch (error) {
      console.error("Error al registrar el usuario:", error);
      throw error;
    }
  };
  const areFiltersApplied = currentStatus
    ? Object.keys(columnStates[currentStatus].currentFilterValues).length > 0
    : (columnStates.all && Object.keys(columnStates.all.currentFilterValues).length > 0);

  // const toggleMobileMenu = () => { // ELIMINADO
  //   setIsMobileMenuOpen(!isMobileMenuOpen);
  // };

  // SE ELIMINA LA CLASE MOBILE-MENU-OPEN DEL HEADER
  return (
    <header className="app-header scrolled">
      <div className="header-left">
        <img src="/accesblanco.png" alt="B2Park Logo" className="header-logo" />
        <nav className="main-nav">
          {/* ELIMINADO: Botón de menú hamburguesa del header */}
          {/* <button className="mobile-menu-button" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <IconX /> : <IconMenu2 />}
          </button> */}

          {/* --- ACCIONES DEL HEADER PARA ESCRITORIO --- */}
          <div className="header-actions">
            {canViewDashboards && (
              <ViewSwitcher isKanbanView={isKanbanView} isDashboardView={isDashboardView} />
            )}
            {(isStatusPage || location.pathname === '/') && (
              <CategoryToolbar
                onFilterButtonClick={() => onFilterButtonClick(currentStatus || 'all')}
                onSortChange={(order) => onSortChange(currentStatus || 'all', order)}
                currentSortOrder={currentStatus ? columnStates[currentStatus].sortOrder : columnStates.all.sortOrder}
                areFiltersApplied={areFiltersApplied}
                onClearFilters={() => onApplyFilter(currentStatus || 'all', {})}
              />
            )}
          </div>

          {/* ELIMINADO: ACCESOS DIRECTOS PARA EL MENÚ MÓVIL (Están ahora en la Sidebar) */}
          {/* <div className="mobile-shortcuts">
            {onStatisticsClick && (
              <>
                <button onClick={() => { onStatisticsClick(StatusType.created); toggleMobileMenu(); }} className="shortcut-button shortcut-created">
                  <IconMessageReport stroke={2} />
                  <span>Sin atender</span>
                </button>
                <button onClick={() => { onStatisticsClick(StatusType.in_progress); toggleMobileMenu(); }} className="shortcut-button shortcut-in-progress">
                  <IconLoader2 stroke={2} />
                  <span>En Progreso</span>
                </button>
                <button onClick={() => { onStatisticsClick(StatusType.resolved); toggleMobileMenu(); }} className="shortcut-button shortcut-resolved">
                  <IconCircleCheck stroke={2} />
                  <span>Resueltas</span>
                </button>
              </>
            )}
          </div> */}
        </nav>
      </div>
      <div className="header-right">
        <div className="user-session">
          {user && user.role === 'admin' && (
            <button className="glass-icon-button" title="Agregar Usuario" onClick={() => setIsAddUserModalOpen(true)}>
              <IconUserPlus stroke={2} size={24} />
            </button>
          )}
          <UserProfileDropdown />
          {user && (
            <button onClick={logout} className="glass-icon-button" title="Cerrar Sesión">
              <IconLogout size={24} />
            </button>
          )}
        </div>
      </div>

      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onAddUser={handleAddUser}
      />
    </header>
  );
};

export default Header;