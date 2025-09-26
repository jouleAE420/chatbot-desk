import React, { useMemo } from 'react';
import type { TicketOptions } from '../../domain/models/incidencia';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { calculateIncidencesByStatus, calculateIncidencesByType, calculateIncidencesByAssignee } from '../../application/services/statistics.service';
import { GenericBackButton } from '../components/GenericBackButton';
import './GeneralDashboardPage.css';

interface Props {
  incidencias: TicketOptions[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const GeneralDashboardPage: React.FC<Props> = ({ incidencias }) => {
  const byStatus = useMemo(() => calculateIncidencesByStatus(incidencias), [incidencias]);
  const byType = useMemo(() => calculateIncidencesByType(incidencias), [incidencias]);
  const byAssignee = useMemo(() => calculateIncidencesByAssignee(incidencias), [incidencias]);

  return (
    <div className="general-dashboard">
      <GenericBackButton to="/" text="Volver al Panel" />

      <div className="kpi-container">
        <div className="kpi-card">
          <h2>Total Incidencias</h2>
          <p>{incidencias.length}</p>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart">
          <h3>Incidencias por Estado</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={byStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {byStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
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
        <div className="chart full-width">
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

export default GeneralDashboardPage;
