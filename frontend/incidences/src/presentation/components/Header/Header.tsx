import React from 'react';
import { useLocation } from 'react-router-dom';
import './Header.css';
import CategoryToolbar from '../CategoryToolbar/CategoryToolbar';
import type { ColumnState } from '../App.tsx';
import { StatusType } from '../../../domain/models/incidencia';
import { IconRestore } from '@tabler/icons-react';

const statusKeyMap: { [key: string]: StatusType } = {
    created: StatusType.created,
    pending: StatusType.pending,
    'in-progress': StatusType.in_progress,
    resolved: StatusType.resolved,
};

interface HeaderProps {
  columnStates: Record<StatusType, ColumnState>;
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

  const statusPageRegex = /^\/(created|pending|in-progress|resolved)$/;
  const isStatusPage = statusPageRegex.test(location.pathname);
  
  const currentStatusKey = location.pathname.substring(1);
  const currentStatus = statusKeyMap[currentStatusKey];

  const isScrolled = true; // Always show the "scrolled" (small) header

  // Determine if any filters are currently applied for the current status
  const areFiltersApplied = currentStatus 
    ? Object.keys(columnStates[currentStatus].currentFilterValues).length > 0 
    : Object.keys(columnStates.all.currentFilterValues).length > 0;

  return (
    <header className={`app-header ${isScrolled ? 'scrolled' : ''}`}>
      <>
        <h1 className="mini-header-title">B2Park</h1>
        {(isStatusPage || location.pathname === '/') && (
          <div className="header-actions">
            <CategoryToolbar
              onFilterButtonClick={() => onFilterButtonClick(currentStatus || 'all')}
              onSortChange={(order) => onSortChange(currentStatus || 'all', order)}
              currentSortOrder={currentStatus ? columnStates[currentStatus].sortOrder : columnStates.all.sortOrder}
            />
            {/* Render restore button only if filters are applied */}
            {areFiltersApplied && (
              <button 
                className="header-icon-button" 
                title="Limpiar filtros"
                onClick={() => onApplyFilter(currentStatus || 'all', {})}>
                <IconRestore stroke={2} />
              </button>
            )}
          </div>
        )}
      </>
    </header>
  );
};

export default Header;