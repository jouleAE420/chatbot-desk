import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import './Header.css';
import CategoryToolbar from '../CategoryToolbar/CategoryToolbar';
import type { ColumnState } from '../../App.tsx';
import { StatusType } from '../../../domain/models/incidencia';
import { useAuth } from '../../context/AuthContext';
import {
  IconReportAnalytics,
  IconChartBar,
  IconLayoutDashboard,
  IconPlus,
  IconClockHour4,
  IconPlayerPlay,
  IconCircleCheck,
  IconLogout
} from '@tabler/icons-react';

// Mapeo de las rutas a los tipos de estado correspondientes
const statusKeyMap: { [key: string]: StatusType } = {
    created: StatusType.created,
    pending: StatusType.pending,
    'in-progress': StatusType.in_progress,
    resolved: StatusType.resolved,
};

//esta interfaz define las propiedades
// que el componente Header espera recibir
interface HeaderProps {
  columnStates: Record<StatusType | 'all', ColumnState>;
  onFilterButtonClick: (status: StatusType | 'all') => void;
  onSortChange: (status: StatusType | 'all', sortOrder: 'asc' | 'desc') => void;
  onApplyFilter: (status: StatusType | 'all', filters: any) => void;
  onStatisticsClick?: (status: StatusType | 'all') => void; // La hacemos opcional
}

//aq2ui es un const que define el componente Header
const Header: React.FC<HeaderProps> = ({
  columnStates,
  onFilterButtonClick,
  onSortChange,
  onApplyFilter,
  onStatisticsClick,
}) => {
  //estos const sirven para manejar la navegacion y obtener informacion de la ruta actual
  const location = useLocation();
  const { user, logout } = useAuth();
  const statusPageRegex = /^\/(created|pending|in-progress|resolved)$/;
  const isStatusPage = statusPageRegex.test(location.pathname);
  const currentStatusKey = location.pathname.substring(1);
  const currentStatus = statusKeyMap[currentStatusKey];
  const isScrolled = true;
  const isGeneralDashboard = location.pathname === '/dashboard/general';
  const isDashboardPage = location.pathname.startsWith('/dashboard');

  const areFiltersApplied = currentStatus 
    ? Object.keys(columnStates[currentStatus].currentFilterValues).length > 0 
    : Object.keys(columnStates.all.currentFilterValues).length > 0;
//retorna el JSX que define la estructura visual del componente
  return (
    <header className={`app-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-left">
        <h1 className="mini-header-title">B2Park</h1>
        <div className="header-actions">
          {isGeneralDashboard && onStatisticsClick ? (
            <>
              <button onClick={() => onStatisticsClick(StatusType.created)} className="header-icon-button" title="Dashboard Creadas">
                <IconPlus stroke={2} />
              </button>
              <button onClick={() => onStatisticsClick(StatusType.pending)} className="header-icon-button" title="Dashboard Pendientes">
                <IconClockHour4 stroke={2} />
              </button>
              <button onClick={() => onStatisticsClick(StatusType.in_progress)} className="header-icon-button" title="Dashboard En Progreso">
                <IconPlayerPlay stroke={2} />
              </button>
              <button onClick={() => onStatisticsClick(StatusType.resolved)} className="header-icon-button" title="Dashboard Resueltas">
                <IconCircleCheck stroke={2} />
              </button>
            </>
          ) : !isGeneralDashboard ? (
            <>
              {/* Mostramos el botón del dashboard general solo si el usuario tiene permisos */}
              {onStatisticsClick && (
                <Link to="/dashboard/general" className="header-icon-button" title="Ver Dashboard General">
                  <IconLayoutDashboard stroke={2} />
                </Link>
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

              {/* Mostramos el botón de estadísticas de estado solo si el usuario tiene permisos */}
              {isStatusPage && currentStatus && onStatisticsClick && (
                <button onClick={() => onStatisticsClick(currentStatus)} className="header-icon-button" title="Ver estadísticas">
                  <IconChartBar stroke={2} />
                </button>
              )}

              {/* Mostramos el botón de dashboard de resueltas solo si el usuario tiene permisos */}
              {onStatisticsClick && location.pathname !== '/' && !isStatusPage && !isDashboardPage && (
                <Link to="/dashboard/resolved" className="header-icon-button" title="Ver Dashboard de Resueltas">
                  <IconReportAnalytics stroke={2} />
                </Link>
              )}
            </>
          ) : null}
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
