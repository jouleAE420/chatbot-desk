import React from 'react';
import { StatusType } from '../../../domain/models/incidencia';
import './StatusActionButtons.css';

interface Props {
  status: StatusType;
  onMoveClick: (newStatus: StatusType) => void;
  className?: string; // NEW
}

const StatusActionButtons: React.FC<Props> = ({ status, onMoveClick, className }) => { // NEW
  return (
    <div className={`card-actions ${className || ''}`}>
      {status === StatusType.created && (
        <>
          <button onClick={() => onMoveClick(StatusType.pending)} className="action-button-move -to-pending">A Pendiente</button>
          <button onClick={() => onMoveClick(StatusType.in_progress)} className="action-button-move -to-progress">A Progreso</button>
        </>
      )}
      {status === StatusType.pending && (
        <button onClick={() => onMoveClick(StatusType.in_progress)} className="action-button-move -to-progress">A Progreso</button>
      )}
      {status === StatusType.in_progress && (
        <button onClick={() => onMoveClick(StatusType.resolved)} className="action-button-move -to-resolved">A Resuelta</button>
      )}
    </div>
  );
};

export default StatusActionButtons;