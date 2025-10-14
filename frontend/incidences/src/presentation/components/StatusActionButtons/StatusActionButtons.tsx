import React from 'react';
import { StatusType } from '../../../domain/models/incidencia';
import './StatusActionButtons.css';
import { IconPlayerPause, IconPlayerPlay, IconCircleCheck, IconBan } from '@tabler/icons-react';

interface Props {
  status: StatusType;
  onMoveClick: (newStatus: StatusType) => void;
  className?: string;
  assignedTo?: string;
}

const StatusActionButtons: React.FC<Props> = ({ status, onMoveClick, className }) => {
  // La lógica de asignación ahora vive en el componente padre (HomePage, IncidenceDetailPage)
  // Este componente solo se encarga de mostrar los botones y notificar el clic.

  return (
    <div className={`card-actions ${className || ''}`}>
      {status === StatusType.created && (
        <>
          <button onClick={() => onMoveClick(StatusType.pending)} className="action-button -to-pending">
            <IconPlayerPause size={16} />
            <span>Pendiente</span>
          </button>
          <button onClick={() => onMoveClick(StatusType.in_progress)} className="action-button -to-progress">
            <IconPlayerPlay size={16} />
            <span>A Progreso</span>
          </button>
        </>
      )}
      {status === StatusType.pending && (
        <button onClick={() => onMoveClick(StatusType.in_progress)} className="action-button -to-progress">
          <IconPlayerPlay size={16} />
          <span>Iniciar Progreso</span>
        </button>
      )}
      {status === StatusType.in_progress && (
        <button onClick={() => onMoveClick(StatusType.resolved)} className="action-button -to-resolved">
          <IconCircleCheck size={16} />
          <span>Marcar Resuelta</span>
        </button>
      )}
    </div>
  );
};

export default StatusActionButtons;