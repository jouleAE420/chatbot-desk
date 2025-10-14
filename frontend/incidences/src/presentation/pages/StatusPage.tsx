//import React, { useMemo, useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import type { TicketOptions } from '../../domain/models/incidencia';
import { StatusType } from '../../domain/models/incidencia';
import IncidenceCardBase from '../components/IncidenceCard/IncidenceCardBase';
import { GenericBackButton } from '../components/GenericBackButton';
import type { ColumnState } from '../App'; 
import FilterForm from '../components/FilterForm/FilterForm'; 
//import { useAuth } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';

import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import './StatusPage.css'; // Import the new CSS file

interface Props {
  incidencias: TicketOptions[];
  onUpdateStatus: (id: number, newStatus: StatusType) => void;
  columnStates: Record<StatusType, ColumnState>;
  onFilterButtonClick: (status: StatusType) => void;
  onApplyFilter: (status: StatusType, filters: any) => void;
  onSortChange: (status: StatusType, sortOrder: 'asc' | 'desc') => void;
  onCloseFilterForm: (status: StatusType) => void;
  onPageChange: (status: StatusType, newPage: number) => void;
  assignees: string[];
}

const statusMap: { [key: string]: { dataValue: StatusType; title: string } } = {
    created: { dataValue: StatusType.created, title: 'Creadas' },
    pending: { dataValue: StatusType.pending, title: 'Pendientes' },
    'in-progress': { dataValue: StatusType.in_progress, title: 'En Progreso' },
    resolved: { dataValue: StatusType.resolved, title: 'Resueltas' },
};

const StatusPage: React.FC<Props> = ({ 
    incidencias, 
    onUpdateStatus,
    columnStates,
    onApplyFilter,
    onCloseFilterForm,
    onPageChange, 
    assignees
}) => {
    const { statusKey } = useParams<{ statusKey: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const itemsPerPage = 8;

    

    const statusInfo = statusKey ? statusMap[statusKey] : undefined;

    if (!statusInfo) {
        return (
            <div>
                <h2>Estado no válido</h2>
                <Link to="/">Volver al inicio</Link>
            </div>
        );
    }

    const currentColumnState = columnStates[statusInfo.dataValue];
    const currentPage = currentColumnState.currentPage;
    
    let filteredIncidencias = incidencias.filter(
        inc => inc.status === statusInfo.dataValue
    );
      if (user?.role === 'operador') {
      if (statusInfo.dataValue === StatusType.created) {
        // Para 'Creadas', los operadores solo ven las incidencias no asignadas
        filteredIncidencias = filteredIncidencias.filter(inc => !inc.assignedTo);
      } else {
        // Para los demás estados, los operadores solo ven las incidencias asignadas a ellos
        filteredIncidencias = filteredIncidencias.filter(inc => inc.assignedTo === user.id);
      }
    }

    if (currentColumnState.currentFilterValues.parkingId) {
        filteredIncidencias = filteredIncidencias.filter(inc =>
            inc.parkingId === currentColumnState.currentFilterValues.parkingId
        );
    }
    if (currentColumnState.currentFilterValues.ticketType) {
        filteredIncidencias = filteredIncidencias.filter(inc =>
            inc.ticketType === currentColumnState.currentFilterValues.ticketType
        );
    }
    if (currentColumnState.currentFilterValues.clientName) {
        filteredIncidencias = filteredIncidencias.filter(inc =>
            inc.clientName.toLowerCase().includes(currentColumnState.currentFilterValues.clientName.toLowerCase())
        );
    }

    if (currentColumnState.sortOrder === 'asc') {
        filteredIncidencias.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else {
        filteredIncidencias.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    const totalPages = Math.ceil(filteredIncidencias.length / itemsPerPage);
    const paginatedIncidencias = filteredIncidencias.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    return (
        <div className={`focused-view ${statusKey}`}>
            <h2 className="column-title">{statusInfo.title}</h2>
            <GenericBackButton to="/" text="Volver al panel" />

            
            {currentColumnState.isFilterFormVisible && (
                <FilterForm
                  isVisible={currentColumnState.isFilterFormVisible}
                  onClose={() => onCloseFilterForm(statusInfo.dataValue)}
                  onApplyFilter={(filters) => onApplyFilter(statusInfo.dataValue, filters)}
                  currentFilterValues={currentColumnState.currentFilterValues}
                  incidencias={incidencias}
                  assignees={assignees} 
                />
            )}

            <div className="focused-grid">
                {paginatedIncidencias.map(incidencia => (
                    <div
                        key={incidencia.id}
                        style={{ cursor: 'pointer' }}
                        onClick={() => navigate(`/incidencias/${incidencia.id}`, { state: { from: location.pathname } })}
                    >
                        <IncidenceCardBase
                            incidencia={incidencia}
                            onUpdateStatus={onUpdateStatus}
                        />
                    </div>
                ))}
            </div>

            <div className="pagination-controls">
              <button onClick={() => onPageChange(statusInfo.dataValue, Math.max(currentPage - 1, 1))} disabled={currentPage === 1}>
                <IconArrowLeft size={16} />
                <span>Anterior</span>
              </button>
              <span>
                Página {currentPage} de {totalPages}
              </span>
              <button onClick={() => onPageChange(statusInfo.dataValue, Math.min(currentPage + 1, totalPages))} disabled={currentPage === totalPages}>
                <span>Siguiente</span>
                <IconArrowRight size={16} />
              </button>
            </div>
        </div>
    );
};
export default StatusPage;