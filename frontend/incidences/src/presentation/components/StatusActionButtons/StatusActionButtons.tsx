import React, { useState } from 'react';
import { createPortal } from 'react-dom'; // Import createPortal
import { StatusType } from '../../../domain/models/incidencia';
import './StatusActionButtons.css';
import AssignModal from '../AssignModal/AssignModal';

interface Props {
  status: StatusType;
  onMoveClick: (newStatus: StatusType, assignedTo?: string) => void;
  className?: string;
  assignedTo?: string; // New prop
}

const StatusActionButtons: React.FC<Props> = ({ status, onMoveClick, className, assignedTo }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState<StatusType | null>(null);

  const handleMoveClick = (newStatus: StatusType) => {
    // Only open modal if moving from 'created' AND no one is assigned yet
    if (status === StatusType.created && !assignedTo && (newStatus === StatusType.pending || newStatus === StatusType.in_progress)) {
      setTargetStatus(newStatus);
      setIsModalOpen(true);
    } else {
      // Otherwise, just move it, keeping the current assignee
      onMoveClick(newStatus, assignedTo);
    }
  };

  const handleModalAction = (action: 'add' | 'edit' | 'delete', value?: string) => {
    if (action === 'add' && value && targetStatus) {
      onMoveClick(targetStatus, value);
    }
    setIsModalOpen(false);
    setTargetStatus(null);
  };

  return (
    <div className={`card-actions ${className || ''}`}>
      {status === StatusType.created && (
        <>
          <button onClick={() => handleMoveClick(StatusType.pending)} className="action-button-move -to-pending">A Pendiente</button>
          <button onClick={() => handleMoveClick(StatusType.in_progress)} className="action-button-move -to-progress">A Progreso</button>
        </>
      )}
      {status === StatusType.pending && (
        <button onClick={() => onMoveClick(StatusType.in_progress, undefined)} className="action-button-move -to-progress">A Progreso</button>
      )}
      {status === StatusType.in_progress && (
        <button onClick={() => onMoveClick(StatusType.resolved, undefined)} className="action-button-move -to-resolved">A Resuelta</button>
      )}

      {createPortal( // Use createPortal here
        <AssignModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          mode="add"
          onAction={handleModalAction}
        />,
        document.body // Render into document.body
      )}
    </div>
  );
};

export default StatusActionButtons;