import React, { useMemo } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import type { TicketOptions } from '../../domain/models/incidencia';
import { StatusType } from '../../domain/models/incidencia';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { calculateIncidencesByType, calculateIncidencesByAssignee } from '../../application/services/statistics.service';
import { GenericBackButton } from '../components/GenericBackButton';
import './StatusDashboardPage.css';

const statusMap: { [key: string]: StatusType } = {
    created: StatusType.created,
    pending: StatusType.pending,
    in_progress: StatusType.in_progress,
};

interface Props {
  incidencias: TicketOptions[];
}

const StatusDashboardPage: React.FC<Props> = ({ incidencias }) => {
  const { status } = useParams<{ status: string }>();
  const location = useLocation();
  const fromPath = location.state?.from || '/';

  const currentStatus = status ? statusMap[status.toLowerCase()] : undefined;

  const filteredIncidences = useMemo(() =>
    currentStatus ? incidencias.filter(inc => inc.status === currentStatus) : []
  , [incidencias, currentStatus]);

  const byType = useMemo(() => calculateIncidencesByType(filteredIncidences), [filteredIncidences]);
  const byAssignee = useMemo(() => calculateIncidencesByAssignee(filteredIncidences), [filteredIncidences]);

  if (!currentStatus) {
    return <div>Estado no válido</div>;
  }

  return (
    <div className={`status-dashboard theme-${status?.toLowerCase()}`}>
      <GenericBackButton to={fromPath} text="Volver" />

      <div className="kpi-container">
        <div className="kpi-card">
          <h2>Total de incidencias</h2>
          <p>{filteredIncidences.length}</p>
        </div>
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
      </div>
    </div>
  );
};

export default StatusDashboardPage;