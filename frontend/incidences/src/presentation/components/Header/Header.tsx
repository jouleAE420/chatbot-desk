import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Header.css';
import CategoryToolbar from '../CategoryToolbar/CategoryToolbar';
import type { ColumnState } from '../../App.tsx';
import { StatusType } from '../../../domain/models/incidencia';
import { useAuth } from '../../context/AuthContext';
import { IconSettings } from '@tabler/icons-react';
import ViewSwitcher from '../ViewSwitcher/ViewSwitcher';
import AddUserModal from '../AddUserModal/AddUserModal';
import { Drawer } from '../Drawer/Drawer';
import { register } from '../../../application/services/auth.service';
import SearchOperatorModal from '../SearchOperatorModal/SearchOperatorModal.tsx';

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
}

const Header: React.FC<HeaderProps> = ({
  columnStates,
  onFilterButtonClick,
  onSortChange,
  onApplyFilter,
}) => {
  const location = useLocation();
  const { user } = useAuth();
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isSearchOperatorModalOpen, setIsSearchOperatorModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const canViewDashboards = user?.role === 'admin' || user?.role === 'supervisor';
  const isDashboardView = location.pathname.startsWith('/dashboard');

  const statusPageRegex = /^\/(created|pending|in-progress|resolved)$/;
  const isStatusPage = statusPageRegex.test(location.pathname);
  const isKanbanView = location.pathname === '/' || isStatusPage;

  const currentStatusKey = location.pathname.substring(1);
  const currentStatus = statusKeyMap[currentStatusKey];

  const handleAddUser = async (userData: { 
    username: string; 
    email: string; 
    role: string; 
    password: string 
  }) => {
    try {
      await register(userData);
    } catch (error) {
      console.error("Error al registrar el usuario:", error);
      throw error;
    }
  };

  const areFiltersApplied = currentStatus
    ? Object.keys(columnStates[currentStatus]?.currentFilterValues || {}).length > 0
    : Object.keys(columnStates.all?.currentFilterValues || {}).length > 0;

  return (
    <header className="app-header scrolled">
      <div className="header-left">
        <img src="/accesblanco.png" alt="B2Park Logo" className="header-logo" />
        <div className="header-actions">
          {canViewDashboards && (
            <ViewSwitcher isKanbanView={isKanbanView} isDashboardView={isDashboardView} />
          )}
          {(isStatusPage || location.pathname === '/') && (
            <CategoryToolbar
              onFilterButtonClick={() => onFilterButtonClick(currentStatus || 'all')}
              onSortChange={(order) => onSortChange(currentStatus || 'all', order)}
              currentSortOrder={
                currentStatus 
                  ? columnStates[currentStatus]?.sortOrder 
                  : columnStates.all?.sortOrder
              }
              areFiltersApplied={areFiltersApplied}
              onClearFilters={() => onApplyFilter(currentStatus || 'all', {})}
            />
          )}
        </div>
      </div>

      <div className="header-right">
        <div className="user-session">
          <button 
            className="glass-icon-button" 
            title="Opciones" 
            onClick={() => setIsDrawerOpen(true)}
          >
            <IconSettings stroke={2} size={24} />
          </button>
        </div>
      </div>

      <SearchOperatorModal
        isOpen={isSearchOperatorModalOpen}
        onClose={() => setIsSearchOperatorModalOpen(false)}
      />

      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onAddUser={handleAddUser}
      />

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpenAddUserModal={() => setIsAddUserModalOpen(true)}
        onOpenSearchOperatorModal={() => setIsSearchOperatorModalOpen(true)}
      />
    </header>
  );
};

export default Header;