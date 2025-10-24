import React, { useState } from 'react';
import type { TicketOptions } from '../../../domain/models/incidencia';
import { StatusType } from '../../../domain/models/incidencia';
import { timeAgo } from '../../utils/date';
import StarRating from '../StarRating';
import useWindowSize from '../../utils/useWindowSize';
import './IncidenceCard.css';
import { IconUser } from '@tabler/icons-react';
import StatusActionButtons from '../StatusActionButtons/StatusActionButtons';
import { createPortal } from 'react-dom';
import AssignModal from '../AssignModal/AssignModal';
import { useAuth } from '../../context/AuthContext';

interface Props {
  incidencia: TicketOptions;
  isDragging?: boolean;
  onUpdateStatus?: (id: number, newStatus: StatusType, assignedTo?: string) => void;
}

const IncidenceCardBase: React.FC<Props> = ({ incidencia, isDragging = false, onUpdateStatus }) => {
  const { width } = useWindowSize();
  const { user } = useAuth();
  const [isAssigneeInfoModalOpen, setIsAssigneeInfoModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignModalMode, setAssignModalMode] = useState<'add' | 'view' | 'edit' | 'delete'>('add');

  const isSupervisor = user?.role === 'supervisor';
  const isAdmin = user?.role === 'admin';
  const isOperator = user?.role === 'operador';
  
  const isResolved = incidencia.status === StatusType.resolved;
  const isRated = isResolved && typeof incidencia.rate === 'number' && incidencia.rate > 0;

  // Simplificado: Función de release
  const handleReleaseIncidence = () => {
    if (onUpdateStatus && !isSupervisor) {
      onUpdateStatus(incidencia.id, StatusType.created, undefined);
    }
    setIsAssigneeInfoModalOpen(false);
  };

  // Simplificado: Update de status
  const handleStatusUpdate = (newStatus: StatusType) => {
    if (!onUpdateStatus) return;

    const shouldAutoAssign = 
      incidencia.status === StatusType.created &&
      (newStatus === StatusType.pending || newStatus === StatusType.in_progress) &&
      !incidencia.assignedTo &&
      isOperator;

    onUpdateStatus(
      incidencia.id, 
      newStatus, 
      shouldAutoAssign ? user?.id : incidencia.assignedTo
    );
  };

  // Simplificado: Manejo del click en assignee
  const handleAssigneeClick = (e: React.MouseEvent) => {
    if (isSupervisor) return;
    e.stopPropagation();

    if (isAdmin) {
      setAssignModalMode(incidencia.assignedTo ? 'view' : 'add');
      setIsAssignModalOpen(true);
    } else if (incidencia.assignedTo) {
      setIsAssigneeInfoModalOpen(true);
    }
  };

  // Simplificado: Acción del AssignModal
  const handleAssignModalAction = (action: string, value?: string) => {
    if (!onUpdateStatus) return;

    if (action === 'delete') {
      onUpdateStatus(incidencia.id, incidencia.status, undefined);
    } else if (value) {
      onUpdateStatus(incidencia.id, incidencia.status, value);
    }
    setIsAssignModalOpen(false);
  };

  // Render del rating o placeholder
  const renderRatingSection = () => {
    if (isRated) {
      return <StarRating rating={incidencia.rate as number} />;
    }
    if (isResolved) {
      return (
        <span className="rating-pending">
          Calificación Pendiente
        </span>
      );
    }
    return <span style={{ minWidth: '80px' }} />;
  };

  return (
    <>
      <div className={`incidencia-card ${incidencia.status} ${isDragging ? 'dragging' : ''} ${isSupervisor ? 'read-only' : ''}`}>
        {/* Header */}
        <div className="card-header">
          <h3>{incidencia.parkingId}</h3>
          <div className="header-right-content">
            <span className="ticket-type">{incidencia.ticketType}</span>
          </div>
        </div>

        {/* Status Buttons (Mobile) */}
        {onUpdateStatus && width && width < 769 && !isSupervisor && (
          <div onClick={(e) => e.stopPropagation()}>
            <StatusActionButtons
              status={incidencia.status}
              assignedTo={incidencia.assignedTo}
              onMoveClick={handleStatusUpdate}
            />
          </div>
        )}

        {/* Footer */}
        <div className="card-footer">
          <div className="footer-left">
            {renderRatingSection()}
            
            {/* Assignee Icon */}
            {incidencia.assignedTo && (
              <div
                className="assignee-icon-container"
                onClick={handleAssigneeClick}
                title={`Asignado a: ${incidencia.assignedTo}`}
              >
                <IconUser stroke={2} size={20} />
              </div>
            )}
          </div>
          
          <p className="time-ago">Hace {timeAgo(incidencia.createdAt)}</p>
        </div>
      </div>

      {/* Assignee Info Modal */}
      {isAssigneeInfoModalOpen && createPortal(
        <div className="assignee-info-modal-overlay" onClick={() => setIsAssigneeInfoModalOpen(false)}>
          <div className="assignee-info-modal-content" onClick={(e) => e.stopPropagation()}>
            <h4>Responsable de la Incidencia</h4>
            <p className="assignee-name">{incidencia.assignedTo}</p>
            <div className="modal-actions">
              <button onClick={() => setIsAssigneeInfoModalOpen(false)} className="button-secondary">
                Cerrar
              </button>
              {user?.id === incidencia.assignedTo && !isSupervisor && (
                <button onClick={handleReleaseIncidence} className="button-danger">
                  Liberar
                </button>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Assign Modal (Admin) */}
      {isAssignModalOpen && (
        <AssignModal
          isOpen={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          mode={assignModalMode}
          currentAssignee={incidencia.assignedTo}
          onAction={handleAssignModalAction}
        />
      )}
    </>
  );
};

export default IncidenceCardBase;