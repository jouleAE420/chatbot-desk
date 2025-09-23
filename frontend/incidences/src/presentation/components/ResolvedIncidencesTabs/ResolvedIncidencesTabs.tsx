import React, { useState, useMemo } from 'react';
import type { TicketOptions } from '../../../domain/models/incidencia';
import IncidenceCard from '../IncidenceCard';
import { StatusType } from '../../../domain/models/incidencia';
import './ResolvedIncidencesTabs.css';

interface ResolvedIncidencesTabsProps {
  incidencias: TicketOptions[]; // All resolved incidences
  onApplyFilter: (status: StatusType | 'all', filters: any) => void;
  onFilterButtonClick: (status: StatusType | 'all') => void;
}

const ResolvedIncidencesTabs: React.FC<ResolvedIncidencesTabsProps> = ({
  incidencias,
  onApplyFilter,
  onFilterButtonClick,
}) => {
  const [activeTab, setActiveTab] = useState('last3Days'); // Default active tab

  const getFilteredIncidencias = useMemo(() => {
    let filtered = incidencias;

    const now = new Date();
    switch (activeTab) {
      case 'last3Days': {
        const threeDaysAgo = new Date(new Date().setDate(now.getDate() - 3));
        filtered = incidencias.filter(inc => new Date(inc.createdAt) >= threeDaysAgo);
        break;
      }
      case 'lastWeek': {
        const lastWeek = new Date(new Date().setDate(now.getDate() - 7));
        filtered = incidencias.filter(inc => new Date(inc.createdAt) >= lastWeek);
        break;
      }
      case 'lastMonth': {
        const lastMonth = new Date(new Date().setMonth(now.getMonth() - 1));
        filtered = incidencias.filter(inc => new Date(inc.createdAt) >= lastMonth);
        break;
      }
      case 'lastTwoMonths': {
        const lastTwoMonths = new Date(new Date().setMonth(now.getMonth() - 2));
        filtered = incidencias.filter(inc => new Date(inc.createdAt) >= lastTwoMonths);
        break;
      }
      default:
        break;
    }
    return filtered.slice(0, 6); // Show max 6
  }, [incidencias, activeTab]);

  const handleViewMore = () => {
    let startDate = '';
    const endDate = new Date().toISOString().split('T')[0];

    const now = new Date();
    switch (activeTab) {
      case 'last3Days': {
        const threeDaysAgo = new Date(new Date().setDate(now.getDate() - 3));
        startDate = threeDaysAgo.toISOString().split('T')[0];
        break;
      }
      case 'lastWeek': {
        const lastWeek = new Date(new Date().setDate(now.getDate() - 7));
        startDate = lastWeek.toISOString().split('T')[0];
        break;
      }
      case 'lastMonth': {
        const lastMonth = new Date(new Date().setMonth(now.getMonth() - 1));
        startDate = lastMonth.toISOString().split('T')[0];
        break;
      }
      case 'lastTwoMonths': {
        const lastTwoMonths = new Date(new Date().setMonth(now.getMonth() - 2));
        startDate = lastTwoMonths.toISOString().split('T')[0];
        break;
      }
      default:
        break;
    }
    onApplyFilter(StatusType.resolved, { startDate, endDate });
    onFilterButtonClick(StatusType.resolved); // Open the filter form to show all results
  };

  return (
    <div className="resolved-incidences-tabs">
      <div className="tabs-header">
        <button
          className={activeTab === 'last3Days' ? 'active' : ''}
          onClick={() => setActiveTab('last3Days')}
        >
          Últimos 3 Días
        </button>
        <button
          className={activeTab === 'lastWeek' ? 'active' : ''}
          onClick={() => setActiveTab('lastWeek')}
        >
          Semana Anterior
        </button>
        <button
          className={activeTab === 'lastMonth' ? 'active' : ''}
          onClick={() => setActiveTab('lastMonth')}
        >
          Hace 1 Mes
        </button>
        <button
          className={activeTab === 'lastTwoMonths' ? 'active' : ''}
          onClick={() => setActiveTab('lastTwoMonths')}
        >
          Hace 2 Meses
        </button>
      </div>
      <div className="tabs-content">
        {getFilteredIncidencias.length > 0 ? (
          getFilteredIncidencias.map(inc => (
            <IncidenceCard key={inc.id} incidencia={inc} onUpdateStatus={() => {}} />
          ))
        ) : (
          <p>No hay incidencias resueltas para este período.</p>
        )}
      </div>
      {incidencias.length > 6 && ( // Only show "Ver Más" if there are more than 6 total resolved incidences
        <button onClick={handleViewMore} className="view-more-button">
          Ver Más
        </button>
      )}
    </div>
  );
};

export default ResolvedIncidencesTabs;