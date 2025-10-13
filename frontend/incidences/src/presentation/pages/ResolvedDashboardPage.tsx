import React, { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import type { TicketOptions } from '../../domain/models/incidencia';
import { StatusType } from '../../domain/models/incidencia';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { calculateResolvedByType, calculateResolvedByAssignee, calculateIncidencesInTimeRange } from '../../application/services/statistics.service'; // <-- calculateIncidencesInTimeRange
import { GenericBackButton } from '../components/GenericBackButton';
import './ResolvedDashboardPage.css';

interface Props {
  incidencias: TicketOptions[];
}

const ResolvedDashboardPage: React.FC<Props> = ({ incidencias }) => {
  const location = useLocation();
  const fromPath = location.state?.from || '/';

  // Estado para el contador interactivo
  const [timeValue, setTimeValue] = useState(7);
  const [timeUnit, setTimeUnit] = useState('days');

  const resolvedIncidences = useMemo(() =>
    incidencias.filter(inc => inc.status === StatusType.resolved)
  , [incidencias]);

  const resolvedByType = useMemo(() => calculateResolvedByType(resolvedIncidences), [resolvedIncidences]);
  const resolvedByAssignee = useMemo(() => calculateResolvedByAssignee(resolvedIncidences), [resolvedIncidences]);
  
  // Cálculo para el contador interactivo
  const resolvedInPeriod = useMemo(() =>
    calculateIncidencesInTimeRange(resolvedIncidences, timeValue, timeUnit as 'days' | 'weeks' | 'months', 'resolvedAt')
  , [resolvedIncidences, timeValue, timeUnit]);

  return (
    <div className="resolved-dashboard theme-resolved">
      <GenericBackButton to={fromPath} text="Volver" />

      {/* KPI Section */}
      <div className="kpi-container">
        <div className="kpi-card">
          <h2>Total Resueltas</h2>
          <p>{resolvedIncidences.length}</p>
        </div>
        {/* KPI Card 2: Resueltas en el periodo (interactivo) */}
        <div className="kpi-card">
          <h2>Resueltas (Últimos {timeValue} {timeUnit === 'days' ? 'días' : timeUnit === 'weeks' ? 'semanas' : 'meses'})</h2>
          <p>{resolvedInPeriod}</p>

          <div className="time-filter-controls" style={{ marginTop: '15px', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <label htmlFor="timeValueInput">Mostrar:</label>
            <input
              id="timeValueInput"
              type="number"
              min="1"
              value={timeValue}
              onChange={(e) => setTimeValue(parseInt(e.target.value) || 1)}
              style={{ width: '60px', padding: '5px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
            <select
              value={timeUnit}
              onChange={(e) => setTimeUnit(e.target.value)}
              style={{ padding: '5px', border: '1px solid #ccc', borderRadius: '4px' }}
            >
              <option value="days">días</option>
              <option value="weeks">semanas</option>
              <option value="months">meses</option>
            </select>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-container">
        <div className="chart">
          <h3>Resueltas por Tipo</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={resolvedByType}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip cursor={{fill: 'rgba(29, 245, 0, 0.1)'}} />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" name="Cantidad" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart">
          <h3>Resueltas por Responsable</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={resolvedByAssignee}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip cursor={{fill: 'rgba(29, 245, 0, 0.1)'}} />
              <Legend />
              <Bar dataKey="value" fill="#82ca9d" name="Cantidad" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ResolvedDashboardPage;