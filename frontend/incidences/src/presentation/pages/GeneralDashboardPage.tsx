import React, { useMemo, useState } from 'react';
import type { TicketOptions } from '../../domain/models/incidencia';
import { StatusType } from '../../domain/models/incidencia';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import {
  calculateIncidencesByStatus,
  calculateIncidencesByType,
  calculateAverageResolutionTime,
  calculateOpenIncidences,
  calculateIncidencesCreatedToday,
  calculateAverageCreatedLast7Days,
} from '../../application/services/statistics.service';
import {
  IconMessageReport,
  IconLoader2,
  IconCircleCheck,
  IconArrowUp,
  IconArrowDown,
  IconMinus,
  IconX,
  // --- ICONOS DE SIDEBAR ---
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
  // --- NUEVO ICONO DE MENÚ HAMBURGUESA ---
  IconMenu2, 
} from '@tabler/icons-react';
import './GeneralDashboardPage.css';

interface Props {
  incidencias: TicketOptions[];
  onStatisticsClick?: (status: StatusType | 'all') => void;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const GeneralDashboardPage: React.FC<Props> = ({ incidencias, onStatisticsClick }) => {
  const openIncidencesThresholds = {
    warning: 10,
    danger: 20,
  };

  const avgResolutionTimeThresholds = {
    good: 24,
    warning: 48,
  };

  // Por defecto, la barra estará abierta en escritorio.
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const byStatus = useMemo(() => calculateIncidencesByStatus(incidencias), [incidencias]);
  const byType = useMemo(() => calculateIncidencesByType(incidencias), [incidencias]);
  const averageResolutionTime = useMemo(() => calculateAverageResolutionTime(incidencias), [incidencias]);
  const openIncidences = useMemo(() => calculateOpenIncidences(incidencias), [incidencias]);
  const incidencesCreatedToday = useMemo(() => calculateIncidencesCreatedToday(incidencias), [incidencias]);
  const avgCreatedLast7Days = useMemo(() => calculateAverageCreatedLast7Days(incidencias), [incidencias]);

  const getKpiClass = (value: number, type: 'openIncidences' | 'avgResolutionTime') => {
    if (type === 'openIncidences') {
      if (value > openIncidencesThresholds.danger) return 'kpi-danger';
      if (value > openIncidencesThresholds.warning) return 'kpi-warning';
      return 'kpi-good';
    }
    if (type === 'avgResolutionTime') {
      if (value > avgResolutionTimeThresholds.warning) return 'kpi-danger';
      if (value > avgResolutionTimeThresholds.good) return 'kpi-warning';
      return 'kpi-good';
    }
    return '';
  };

  // Función de toggle unificada
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`general-dashboard ${isSidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
     
      {/* Botón flotante eliminado */}

      {onStatisticsClick && (
        // --- 1. LA NUEVA BARRA LATERAL ---
        <aside className="shortcuts-sidebar">
          <header className="sidebar-header">
            {isSidebarOpen && <h3 className="sidebar-title">Accesos Directos</h3>}
            {/* El botón de toggle en desktop se mantiene para colapsar/expandir */}
            <button onClick={toggleSidebar} className="sidebar-toggle-button">
              {isSidebarOpen ? <IconLayoutSidebarLeftCollapse /> : <IconLayoutSidebarLeftExpand />}
            </button>
          </header>
          <div className="dashboard-shortcuts">
            {/* Se añade la función toggleMobileMenu para cerrar al hacer clic en móvil */}
            <button onClick={() => { onStatisticsClick(StatusType.created); if (window.innerWidth <= 992) toggleSidebar(); }} className="shortcut-button shortcut-created" title="Dashboard Creadas">
              <IconMessageReport stroke={2} className="created-icon" />
              {isSidebarOpen && <span>Sin atender</span>}
            </button>
            <button onClick={() => { onStatisticsClick(StatusType.in_progress); if (window.innerWidth <= 992) toggleSidebar(); }} className="shortcut-button shortcut-in-progress" title="Dashboard En Progreso">
              <IconLoader2 stroke={2} className="in-progress-icon" />
              {isSidebarOpen && <span>En Progreso</span>}
            </button>
            <button onClick={() => { onStatisticsClick(StatusType.resolved); if (window.innerWidth <= 992) toggleSidebar(); }} className="shortcut-button shortcut-resolved" title="Dashboard Resueltas">
              <IconCircleCheck stroke={2} className="resolved-icon" />
              {isSidebarOpen && <span>Resueltas</span>}
            </button>
          </div>
        </aside>
      )}

      <main className="main-content">
        <div className="kpi-container">
          <div className="dashboard-card kpi-card">
            <h2>Total Incidencias</h2>
            <p>{incidencias.length}</p>
          </div>
          <div className={`dashboard-card kpi-card ${getKpiClass(openIncidences, 'openIncidences')}`}>
            <h2>Incidencias Abiertas</h2>
            <p>{openIncidences}</p>
          </div>
          <div className="dashboard-card kpi-card">
            <h2>Creadas Hoy</h2>
            <p>{incidencesCreatedToday}</p>
            {incidencesCreatedToday > avgCreatedLast7Days && (
              <span className="kpi-trend kpi-trend-up">
                <IconArrowUp size={16} /> Mayor que promedio
              </span>
            )}
            {incidencesCreatedToday < avgCreatedLast7Days && (
              <span className="kpi-trend kpi-trend-down">
                <IconArrowDown size={16} /> Menor que promedio
              </span>
            )}
            {incidencesCreatedToday === avgCreatedLast7Days && (
              <span className="kpi-trend kpi-trend-same">
                <IconMinus size={16} /> Igual que promedio
              </span>
            )}
          </div>
          <div className={`dashboard-card kpi-card ${getKpiClass(averageResolutionTime, 'avgResolutionTime')}`}>
            <h2>Tiempo Promedio de Resolución</h2>
            <p>{averageResolutionTime}h</p>
          </div>
        </div>

        <div className="charts-container">
          <div className="dashboard-card chart-card">
            <h3>Incidencias por Tipo</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={byType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => (percent ? `${name} ${((percent as number) * 100).toFixed(0)}%` : name)}
                >
                 {byType.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="dashboard-card chart-card">
            <h3>Incidencias por Estado</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={byStatus}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#82ca9d" name="Número de Incidencias" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GeneralDashboardPage;