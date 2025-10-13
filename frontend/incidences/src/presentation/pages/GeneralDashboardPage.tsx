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
  calculateAverageCreatedLast7Days, // <-- Añadido
} from '../../application/services/statistics.service';
import {
  IconMessageReport,
  IconLoader2,
  IconCircleCheck,
  IconMenu2,
  IconX,
  IconArrowUp,   // <-- Añadido
  IconArrowDown, // <-- Añadido
  IconMinus,     // <-- Añadido
} from '@tabler/icons-react';
import './GeneralDashboardPage.css';

interface Props {
  incidencias: TicketOptions[];
  onStatisticsClick?: (status: StatusType | 'all') => void;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const GeneralDashboardPage: React.FC<Props> = ({ incidencias, onStatisticsClick }) => {
  // Umbrales para la coloración de KPIs
  const openIncidencesThresholds = {
    warning: 10, // Más de 10 abiertas es advertencia
    danger: 20,  // Más de 20 abiertas es peligro
  };

  const avgResolutionTimeThresholds = {
    good: 24, // Menos de 24 horas es bueno
    warning: 48, // Entre 24 y 48 horas es advertencia
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const byStatus = useMemo(() => calculateIncidencesByStatus(incidencias), [incidencias]);
  const byType = useMemo(() => calculateIncidencesByType(incidencias), [incidencias]);
 // const byAssignee = useMemo(() => calculateIncidencesByAssignee(incidencias), [incidencias]); // Descomentado si se usa en alguna gráfica
  const averageResolutionTime = useMemo(() => calculateAverageResolutionTime(incidencias), [incidencias]);
  const openIncidences = useMemo(() => calculateOpenIncidences(incidencias), [incidencias]);
  const incidencesCreatedToday = useMemo(() => calculateIncidencesCreatedToday(incidencias), [incidencias]);
  const avgCreatedLast7Days = useMemo(() => calculateAverageCreatedLast7Days(incidencias), [incidencias]); // <-- Añadido

  // Función auxiliar para obtener la clase CSS del KPI
  const getKpiClass = (value: number, type: 'openIncidences' | 'avgResolutionTime') => {
    if (type === 'openIncidences') {
      if (value > openIncidencesThresholds.danger) return 'kpi-danger';
      if (value > openIncidencesThresholds.warning) return 'kpi-warning';
      return 'kpi-good'; // Por defecto para pocas incidencias abiertas
    }
    if (type === 'avgResolutionTime') {
      if (value > avgResolutionTimeThresholds.warning) return 'kpi-danger'; // Mayor tiempo es peor
      if (value > avgResolutionTimeThresholds.good) return 'kpi-warning'; // Tiempo medio
      return 'kpi-good'; // Menor tiempo es mejor
    }
    return '';
  };

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
              <span>Sin atender</span> {/* <-- Texto modificado */}
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
          <div className={`kpi-card ${getKpiClass(openIncidences, 'openIncidences')}`}> {/* <-- Clase dinámica */}
            <h2>Incidencias Abiertas</h2>
            <p>{openIncidences}</p>
          </div>
          <div className="kpi-card">
            <h2>Creadas Hoy</h2>
            <p>{incidencesCreatedToday}</p>
            {/* Indicador de Tendencia */}
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
          <div className={`kpi-card ${getKpiClass(averageResolutionTime, 'avgResolutionTime')}`}> {/* <-- Clase dinámica */}
            <h2>Tiempo Promedio de Resolución</h2>
            <p>{averageResolutionTime}h</p> 
            
          </div>
        </div>

        <div className="charts-container">
          <div className="chart-card">
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

          <div className="chart-card">
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
      </div>
    </div>
  );
};

export default GeneralDashboardPage;