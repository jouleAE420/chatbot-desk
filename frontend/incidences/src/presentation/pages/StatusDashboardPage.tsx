import React, { useMemo, useState } from 'react'; // useState es necesario ahora para el contador interactivo en ESTE componente
import { useParams, useLocation } from 'react-router-dom';
import type { TicketOptions } from '../../domain/models/incidencia';
import { StatusType } from '../../domain/models/incidencia';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { calculateIncidencesByType, calculateIncidencesByAssignee, calculateIncidenceAging, calculateAvgTimeByAssignee, calculateIncidencesInTimeRange } from '../../application/services/statistics.service'; // calculateIncidencesInTimeRange añadido
import { GenericBackButton } from '../components/GenericBackButton';
import './StatusDashboardPage.css';

const statusMap: { [key: string]: StatusType } = {
    created: StatusType.created,
    pending: StatusType.pending, // DESCOMENTADO
    in_progress: StatusType.in_progress,
};
const titleMap: {[key: string]: string} = {
    created: 'Total de incidencias sin atender',
    in_progress: 'Total de incidencias atendiendo',
    pending: 'Total de incidencias pendientes',
};

interface Props {
  incidencias: TicketOptions[];
}

const StatusDashboardPage: React.FC<Props> = ({ incidencias }) => {
  const { status } = useParams<{ status: string }>();
  const location = useLocation();
  const fromPath = location.state?.from || '/';

  // Estado para el contador interactivo en ESTE componente
  const [timeValue, setTimeValue] = useState(7);
  const [timeUnit, setTimeUnit] = useState('days');

  const currentStatus = status ? statusMap[status.toLowerCase()] : undefined;

  const filteredIncidences = useMemo(() =>
    currentStatus ? incidencias.filter(inc => inc.status === currentStatus) : []
  , [incidencias, currentStatus]);

  const byType = useMemo(() => calculateIncidencesByType(filteredIncidences), [filteredIncidences]);
  const byAssignee = useMemo(() => calculateIncidencesByAssignee(filteredIncidences), [filteredIncidences]);
  const byAging = useMemo(() => calculateIncidenceAging(filteredIncidences), [filteredIncidences]);
  const avgTimeByAssignee = useMemo(() => calculateAvgTimeByAssignee(filteredIncidences), [filteredIncidences]);

  // Cálculo para el contador interactivo en ESTE componente
  const incidencesInPeriod = useMemo(() =>
    calculateIncidencesInTimeRange(filteredIncidences, timeValue, timeUnit as 'days' | 'weeks' | 'months', 'createdAt')
  , [filteredIncidences, timeValue, timeUnit]);

  if (!currentStatus) {
    return <div>Estado no válido</div>;
  }

  return (
    <div className={`status-dashboard theme-${status?.toLowerCase()}`}>
      <GenericBackButton to={fromPath} text="Volver" />

      <div className="kpi-container">
        <div className="kpi-card">
          <h2>{status ? titleMap[status.toLowerCase()] || 'Total de incidencias' : 'Total de incidencias'}</h2>
          <p>{filteredIncidences.length}</p>
        </div>
        {/* --- NUEVA TARJETA KPI INTERACTIVA PARA ESTE DASHBOARD --- */}
        <div className="kpi-card">
          <h2>Incidencias (Últimos {timeValue} {timeUnit === 'days' ? 'días' : timeUnit === 'weeks' ? 'semanas' : 'meses'})</h2>
          <p>{incidencesInPeriod}</p>

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
        {/* ------------------------------------------------------- */}
      </div>

      <div className="charts-container">
        <div className="chart">
            <h3>Incidencias por Tipo</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={byType}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip cursor={{fill: 'rgba(29, 245, 0, 0.1)'}} />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" name="Cantidad" />
              </BarChart>
            </ResponsiveContainer>
        </div>

        {status?.toLowerCase() === 'created' && (
          <div className="chart">
            <h3>Antigüedad de Incidencias</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={byAging}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip cursor={{fill: 'rgba(255, 198, 88, 0.1)'}} />
                <Legend />
                <Bar dataKey="value" fill="#ffc658" name="Nº de Incidencias" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {status?.toLowerCase() === 'in_progress' && (
          <div className="chart">
            <h3>Tiempo Promedio por Responsable (días)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={avgTimeByAssignee}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip cursor={{fill: 'rgba(130, 202, 157, 0.1)'}} />
                <Legend />
                <Bar dataKey="value" fill="#82ca9d" name="Días Promedio" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {status?.toLowerCase() !== 'created' && status?.toLowerCase() !== 'in_progress' && (
          <div className="chart">
            <h3>Incidencias por Responsable</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={byAssignee}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip cursor={{fill: 'rgba(29, 245, 0, 0.1)'}} />
                <Legend />
                <Bar dataKey="value" fill="#82ca9d" name="Cantidad" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusDashboardPage;