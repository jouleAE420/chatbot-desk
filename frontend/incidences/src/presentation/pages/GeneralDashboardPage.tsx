import React, { useMemo, useState } from 'react';
import type { TicketOptions } from '../../domain/models/incidencia';
import { StatusType } from '../../domain/models/incidencia';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import {
  calculateIncidencesByStatus,
  calculateIncidencesByType,
  calculateIncidencesByAssignee,
  calculateAverageResolutionTime,
  calculateOpenIncidences,
  calculateIncidencesCreatedToday,
} from '../../application/services/statistics.service';
import {
  IconMessageReport,
  IconLoader2,
  IconCircleCheck,
  IconMenu2,
  IconX,
} from '@tabler/icons-react';
import './GeneralDashboardPage.css';

interface Props {
  incidencias: TicketOptions[];
  onStatisticsClick?: (status: StatusType | 'all') => void;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const GeneralDashboardPage: React.FC<Props> = ({ incidencias, onStatisticsClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const byStatus = useMemo(() => calculateIncidencesByStatus(incidencias), [incidencias]);
  const byType = useMemo(() => calculateIncidencesByType(incidencias), [incidencias]);
  const byAssignee = useMemo(() => calculateIncidencesByAssignee(incidencias), [incidencias]);
  const averageResolutionTime = useMemo(() => calculateAverageResolutionTime(incidencias), [incidencias]);
  const openIncidences = useMemo(() => calculateOpenIncidences(incidencias), [incidencias]);
  const incidencesCreatedToday = useMemo(() => calculateIncidencesCreatedToday(incidencias), [incidencias]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className={`general-dashboard ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
      {onStatisticsClick && (
        <div className="shortcuts-container">
          <button className="mobile-menu-button" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <IconX /> : <IconMenu2 />}
          </button>
          <div className="dashboard-shortcuts">
            <button onClick={() => onStatisticsClick(StatusType.created)} className="shortcut-button shortcut-created" title="Dashboard Creadas">
              <IconMessageReport stroke={2} className="created-icon" />
              <span>Creadas</span>
            </button>
            <button onClick={() => onStatisticsClick(StatusType.in_progress)} className="shortcut-button shortcut-in-progress" title="Dashboard En Progreso">
              <IconLoader2 stroke={2} className="in-progress-icon" />
              <span>En Progreso</span>
            </button>
            <button onClick={() => onStatisticsClick(StatusType.resolved)} className="shortcut-button shortcut-resolved" title="Dashboard Resueltas">
              <IconCircleCheck stroke={2} className="resolved-icon" />
              <span>Resueltas</span>
            </button>
          </div>
        </div>
      )}

      <div className="main-content">
        <div className="kpi-container">
          <div className="kpi-card">
            <h2>Total Incidencias</h2>
            <p>{incidencias.length}</p>
          </div>
          <div className="kpi-card">
            <h2>Incidencias Abiertas</h2>
            <p>{openIncidences}</p>
          </div>
          <div className="kpi-card">
            <h2>Creadas Hoy</h2>
            <p>{incidencesCreatedToday}</p>
          </div>
          <div className="kpi-card">
            <h2>Tiempo Promedio de Resolución</h2>
            <p>{averageResolutionTime}</p>
          </div>
        </div>

        <div className="charts-container">
          {/* ... gráficos */}
        </div>
      </div>
    </div>
  );
};

export default GeneralDashboardPage;