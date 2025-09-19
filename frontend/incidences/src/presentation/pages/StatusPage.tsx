import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import type { TicketOptions } from '../../domain/models/incidencia';
import { StatusType } from '../../domain/models/incidencia';
import IncidenceCardBase from '../components/IncidenceCard/IncidenceCardBase';
import useWindowSize from '../utils/useWindowSize'; // Import the hook
import { GenericBackButton } from '../components/GenericBackButton'; // Nueva importación

interface Props {
  incidencias: TicketOptions[];
  onUpdateStatus: (id: number, newStatus: StatusType) => void;
}

const statusMap: { [key: string]: { dataValue: StatusType; title: string } } = {
    created: { dataValue: StatusType.created, title: 'Creadas' },
    pending: { dataValue: StatusType.pending, title: 'Pendientes' },
    'in-progress': { dataValue: StatusType.in_progress, title: 'En Progreso' },
    resolved: { dataValue: StatusType.resolved, title: 'Resueltas' },
};

const StatusPage: React.FC<Props> = ({ incidencias, onUpdateStatus }) => {
    const { statusKey } = useParams<{ statusKey: string }>();
    const [filteredIncidencias, setFilteredIncidencias] = useState<TicketOptions[]>([]);
    const navigate = useNavigate();
    const location = useLocation();
    const { width } = useWindowSize(); // Use the hook

    const statusInfo = statusKey ? statusMap[statusKey] : undefined;

    useEffect(() => {
        if (statusInfo) {
            const filtered = incidencias.filter(
                inc => inc.status === statusInfo.dataValue
            );
            setFilteredIncidencias(filtered);
        }
    }, [incidencias, statusInfo]);

    if (!statusInfo) {
        return (
            <div>
                <h2>Estado no válido</h2>
                <Link to="/">Volver al inicio</Link>
            </div>
        );
    }

    return (
        <div className={`focused-view ${statusKey}`}>
            <h2 className="column-title">{statusInfo.title}</h2>
            <GenericBackButton to="/" text="Volver al panel" />
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