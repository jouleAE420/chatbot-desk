import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import './Header.css';
import CategoryToolbar from '../CategoryToolbar/CategoryToolbar';
import type { ColumnState } from '../../App.tsx';
import { StatusType } from '../../../domain/models/incidencia';
import { IconReportAnalytics } from '@tabler/icons-react';

// Mapeo de las rutas a los tipos de estado correspondientes
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
  const statusPageRegex = /^\/(created|pending|in-progress|resolved)$/;
  const isStatusPage = statusPageRegex.test(location.pathname);
  const currentStatusKey = location.pathname.substring(1);
  const currentStatus = statusKeyMap[currentStatusKey];
  const isScrolled = true;

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
              areFiltersApplied={areFiltersApplied}
              onClearFilters={() => onApplyFilter(currentStatus || 'all', {})}
            />
            <Link to="/resolved" className="header-icon-button" title="Ver Dashboard de Resueltas">
              <IconReportAnalytics stroke={2} />
            </Link>
          </div>
        )}
      </>
    </header>
  );
};

export default Header;
