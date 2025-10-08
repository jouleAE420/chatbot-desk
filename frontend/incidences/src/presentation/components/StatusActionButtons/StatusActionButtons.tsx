import React from 'react';
import { StatusType } from '../../../domain/models/incidencia';
import './StatusActionButtons.css';
import { useAuth } from '../../context/AuthContext'; // Import useAuth

interface Props {
  status: StatusType;
  onMoveClick: (newStatus: StatusType, assignedTo?: string) => void;
  className?: string;
  assignedTo?: string;
}

const StatusActionButtons: React.FC<Props> = ({ status, onMoveClick, className, assignedTo }) => {
  const { user } = useAuth(); // Get the logged-in user

  const handleMoveClick = (newStatus: StatusType) => {
    // If moving to pending or in_progress, automatically assign the current user
    if (newStatus === StatusType.pending || newStatus === StatusType.in_progress) {
      onMoveClick(newStatus, user?.username); // Use logged-in user's name
    } else {
      // For other statuses (like resolved), just move it without changing assignee
      onMoveClick(newStatus, assignedTo);
    }
  };

  return (
    <div className={`card-actions ${className || ''}`}>
      {user?.role === 'admin' && assignedTo && (
        <button onClick={() => onMoveClick(status, undefined)} className="action-button-move -unassign">Desasignar</button>
      )}
      {status === StatusType.created && (
        <>
          <button onClick={() => handleMoveClick(StatusType.pending)} className="action-button-move -to-pending">A Pendiente</button>
          <button onClick={() => handleMoveClick(StatusType.in_progress)} className="action-button-move -to-progress">A Progreso</button>
        </>
      )}
      {status === StatusType.pending && (
        <button onClick={() => handleMoveClick(StatusType.in_progress)} className="action-button-move -to-progress">A Progreso</button>
      )}
      {status === StatusType.in_progress && (
        <button onClick={() => handleMoveClick(StatusType.resolved)} className="action-button-move -to-resolved">A Resuelta</button>
      )}
    </div>
  );
};

export default StatusActionButtons;
