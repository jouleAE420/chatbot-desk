import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { TicketOptions } from '../../domain/models/incidencia';
import { StatusType } from '../../domain/models/incidencia';
import IncidenceCardBase from '../components/IncidenceCard/IncidenceCardBase'; // Use the base component

interface Props {
  incidencias: TicketOptions[];
  onUpdateStatus: (id: number, newStatus: StatusType) => void; // Keep for now, passed by App.tsx
}

// Mapeo de URL a datos y títulos
const statusMap: { [key: string]: { dataValue: StatusType; title: string } } = {
    created: { dataValue: StatusType.created, title: 'Creadas' },
    pending: { dataValue: StatusType.pending, title: 'Pendientes' },
    'in-progress': { dataValue: StatusType.in_progress, title: 'En Progreso' },
    resolved: { dataValue: StatusType.resolved, title: 'Resueltas' },
};

const StatusPage: React.FC<Props> = ({ incidencias, onUpdateStatus }) => {
    const { statusKey } = useParams<{ statusKey: string }>();
    const [filteredIncidencias, setFilteredIncidencias] = useState<TicketOptions[]>([]);

    // Asegurarse de que la clave de estado exista en el mapa
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
            <Link to="/" className="back-link">← Volver al panel</Link>
            <div className="focused-grid">
                {filteredIncidencias.map(incidencia => (
                    <IncidenceCardBase
                        key={incidencia.id}
                        incidencia={incidencia}
                        onUpdateStatus={onUpdateStatus}
                    />
                ))}
            </div>
        </div>
    );
};
export default StatusPage;