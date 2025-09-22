import React from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import type { TicketOptions } from '../../domain/models/incidencia';
import { StatusType } from '../../domain/models/incidencia';
import IncidenceCardBase from '../components/IncidenceCard/IncidenceCardBase';
import { GenericBackButton } from '../components/GenericBackButton';
import type { ColumnState } from '../App'; 
import FilterForm from '../components/FilterForm/FilterForm'; 

interface Props {
  incidencias: TicketOptions[];
  onUpdateStatus: (id: number, newStatus: StatusType) => void;
  columnStates: Record<StatusType, ColumnState>;
  onFilterButtonClick: (status: StatusType) => void;
  onApplyFilter: (status: StatusType, filters: any) => void;
  onSortChange: (status: StatusType, sortOrder: 'asc' | 'desc') => void;
  onCloseFilterForm: (status: StatusType) => void; // Added prop
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
    onFilterButtonClick,
    onApplyFilter,
    onSortChange,
    onCloseFilterForm // Destructured prop
}) => {
    const { statusKey } = useParams<{ statusKey: string }>();
    const navigate = useNavigate();
    const location = useLocation();

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
    
    let filteredIncidencias = incidencias.filter(
        inc => inc.status === statusInfo.dataValue
    );

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

    return (
        <div className={`focused-view ${statusKey}`}>
            <h2 className="column-title">{statusInfo.title}</h2>
            <GenericBackButton to="/" text="Volver al panel" />
            
            {currentColumnState.isFilterFormVisible && (
                <FilterForm
                  isVisible={currentColumnState.isFilterFormVisible}
                  onClose={() => onCloseFilterForm(statusInfo.dataValue)} // Correctly using the prop
                  onApplyFilter={(filters) => onApplyFilter(statusInfo.dataValue, filters)}
                  currentFilterValues={currentColumnState.currentFilterValues}
                  incidencias={incidencias} 
                />
            )}

            <div className="focused-grid">
                {filteredIncidencias.map(incidencia => (
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
        </div>
    );
};
export default StatusPage;