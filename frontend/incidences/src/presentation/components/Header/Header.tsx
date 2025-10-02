import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import './Header.css';
import CategoryToolbar from '../CategoryToolbar/CategoryToolbar';
import type { ColumnState } from '../../App.tsx';
import { StatusType } from '../../../domain/models/incidencia';
import { useAuth } from '../../context/AuthContext';
import {
  IconChartBar,
  IconLayoutKanban, // New Icon
  IconLogout
} from '@tabler/icons-react';

import ViewSwitcher from '../ViewSwitcher/ViewSwitcher';

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
}) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  // --- New Simplified Logic ---
  const canViewDashboards = user?.role === 'admin' || user?.role === 'supervisor';
  const isDashboardView = location.pathname.startsWith('/dashboard');
  
  const statusPageRegex = /^\/(created|pending|in-progress|resolved)$/;
  const isStatusPage = statusPageRegex.test(location.pathname);
  const isKanbanView = location.pathname === '/' || isStatusPage;

  const currentStatusKey = location.pathname.substring(1);
  const currentStatus = statusKeyMap[currentStatusKey];
  
  const areFiltersApplied = currentStatus 
    ? Object.keys(columnStates[currentStatus].currentFilterValues).length > 0 
    : (columnStates.all && Object.keys(columnStates.all.currentFilterValues).length > 0);
  // --- End New Logic ---

  return (
    <header className="app-header scrolled">
      <div className="header-left">
        <h1 className="mini-header-title">B2Park</h1>
        <div className="header-actions">
          {canViewDashboards ? (
            // View for Admin / Supervisor
            <ViewSwitcher isKanbanView={isKanbanView} isDashboardView={isDashboardView} />
          ) : (
            // View for Technician
            <>
              {(isStatusPage || location.pathname === '/') && (
                <CategoryToolbar
                  onFilterButtonClick={() => onFilterButtonClick(currentStatus || 'all')}
                  onSortChange={(order) => onSortChange(currentStatus || 'all', order)}
                  currentSortOrder={currentStatus ? columnStates[currentStatus].sortOrder : columnStates.all.sortOrder}
                  areFiltersApplied={areFiltersApplied}
                  onClearFilters={() => onApplyFilter(currentStatus || 'all', {})}
                />
              )}
            </>
          )}
        </div>
      </div>
      <div className="header-right">
        <div className="user-session">
          <span className="username">Hola, {user?.username}</span>
          <button onClick={logout} className="logout-button" title="Cerrar Sesión">
            <IconLogout stroke={2} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
