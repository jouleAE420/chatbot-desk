import React, { useState } from 'react';
import type { TicketOptions } from '../../../domain/models/incidencia';
import { StatusType } from '../../../domain/models/incidencia';
import { timeAgo } from '../../utils/date';
import StarRating from '../StarRating';
import useWindowSize from '../../utils/useWindowSize';
import './IncidenceCard.css';
import { IconUserPlus, IconUser } from '@tabler/icons-react'; // Import Tabler Icons
import AssignModal from '../AssignModal/AssignModal'; // Import AssignModal
import StatusActionButtons from '../StatusActionButtons/StatusActionButtons';
import { createPortal } from 'react-dom';
// Define las props que el componente espera recibir
interface Props {
  incidencia: TicketOptions;
  isDragging?: boolean;
  onUpdateStatus?: (id: number, newStatus: StatusType, assignedTo?: string) => void;
}
//componente funcional de react
const IncidenceCardBase: React.FC<Props> = ({ incidencia, isDragging = false, onUpdateStatus }) => {
  const { width } = useWindowSize();
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignModalMode, setAssignModalMode] = useState<'add' | 'view' | 'edit' | 'delete'>('add');
//esta funcion maneja las acciones de asignacion, edicion y eliminacion del responsable
  const handleAssignAction = (action: 'add' | 'edit' | 'delete', value?: string) => {
    let newAssignedTo: string | undefined = incidencia.assignedTo;
    if (action === 'add' || action === 'edit') {
      newAssignedTo = value;
    } else if (action === 'delete') {
      newAssignedTo = undefined;
    }
    // Actualizamos el estado de la incidencia con el nuevo responsable
    if (onUpdateStatus) {
      onUpdateStatus(incidencia.id, incidencia.status, newAssignedTo);
    }
  };
//esta funcion abre el modal de asignacion en el modo especificado
  const openAssignModal = (mode: 'add' | 'view') => {
    setAssignModalMode(mode);
    setIsAssignModalOpen(true);
  };
//returna el JSX que define la estructura visual del componente
  return (
    <div className={`incidencia-card ${incidencia.status} ${isDragging ? 'dragging' : ''}`}>
      <div className="card-header">
        <h3>{incidencia.parkingId}</h3>
        <div className="header-right-content">
          <span className="ticket-type">{incidencia.ticketType}</span>
          <div className="assignee-icon-container" onClick={(e) => { e.stopPropagation(); openAssignModal(incidencia.assignedTo ? 'view' : 'add'); }}>
            {incidencia.assignedTo ? (
              <IconUser stroke={2} size={24} className="assignee-icon" />
            ) : (
              <IconUserPlus stroke={2} size={24} className="assignee-icon" />
            )}
          </div>
        </div>
      </div>
      <StarRating rating={incidencia.rate} />
      <p className="time-ago">Hace {timeAgo(incidencia.createdAt)}</p>

      {/* Status Action Buttons (only for small screens, as per original design) */}
      {onUpdateStatus && width && width < 769 && (
        <div onClick={(e) => e.stopPropagation()}>
          <StatusActionButtons
            status={incidencia.status}
            assignedTo={incidencia.assignedTo}
            onMoveClick={(newStatus, assignedTo) => {
              if (onUpdateStatus) {
                onUpdateStatus(incidencia.id, newStatus, assignedTo);
              }
            }}
          />
        </div>
      )}

      {createPortal(
        <AssignModal
          isOpen={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          mode={assignModalMode}
          currentAssignee={incidencia.assignedTo}
          onAction={handleAssignAction}
        />,
        document.body
      )}
    </div>
  );
};

export default IncidenceCardBase;