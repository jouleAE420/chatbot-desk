import React, { useMemo } from 'react';
import type { TicketOptions } from '../../domain/models/incidencia';
import { StatusType } from '../../domain/models/incidencia';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { calculateResolvedByType, calculateResolvedByAssignee, calculateResolvedInLastWeek } from '../../application/services/statistics.service';
import { GenericBackButton } from '../components/GenericBackButton';
import './ResolvedDashboardPage.css';

interface Props {
  incidencias: TicketOptions[];
}

const ResolvedDashboardPage: React.FC<Props> = ({ incidencias }) => {
  const resolvedIncidences = useMemo(() =>
    incidencias.filter(inc => inc.status === StatusType.resolved)
  , [incidencias]);

  const resolvedByType = useMemo(() => calculateResolvedByType(resolvedIncidences), [resolvedIncidences]);
  const resolvedByAssignee = useMemo(() => calculateResolvedByAssignee(resolvedIncidences), [resolvedIncidences]);
  const resolvedLastWeek = useMemo(() => calculateResolvedInLastWeek(resolvedIncidences), [resolvedIncidences]);

  return (
    <div className="resolved-dashboard theme-resolved">
      <GenericBackButton to="/" text="Volver al Panel" />

      {/* KPI Section */}
      <div className="kpi-container">
        <div className="kpi-card">
          <h2>Total Resueltas</h2>
          <p>{resolvedIncidences.length}</p>
        </div>
        <div className="kpi-card">
          <h2>Resueltas (Últimos 7 días)</h2>
          <p>{resolvedLastWeek}</p>
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
