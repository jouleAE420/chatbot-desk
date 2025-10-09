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

  const handleReleaseIncidence = () => {
    if (onUpdateStatus && !isSupervisor) {
      onUpdateStatus(incidencia.id, StatusType.created, undefined);
    }
    setIsAssigneeInfoModalOpen(false);
  };

  return (
    <div className={`incidencia-card ${incidencia.status} ${isDragging ? 'dragging' : ''} ${isSupervisor ? 'read-only' : ''}`}>
      <div className="card-header">
        <h3>{incidencia.parkingId}</h3>
        <div className="header-right-content">
          <span className="ticket-type">{incidencia.ticketType}</span>
        </div>
      </div>

      {/* Status Action Buttons (only for small screens and not for supervisors) */}
      {onUpdateStatus && width && width < 769 && !isSupervisor && (
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

      <div className="card-footer">
        <div className="footer-left">
          <StarRating rating={incidencia.rate} />
          <div
            className="assignee-icon-container"
            onClick={(e) => {
              if (isSupervisor) return; // Disable click for supervisor
              e.stopPropagation();
              // Admins can open the AssignModal to add/edit/delete assignee
              if (user?.role === 'admin') {
                setAssignModalMode(incidencia.assignedTo ? 'view' : 'add');
                setIsAssignModalOpen(true);
                return;
              }
              // Non-admins keep previous behavior (view assignee info only if assigned)
              if (incidencia.assignedTo) {
                setIsAssigneeInfoModalOpen(true);
              }
            }}
          >
            {incidencia.assignedTo && (
              <IconUser stroke={2} size={24} className="assignee-icon" title={`Asignado a: ${incidencia.assignedTo}`} />
            )}
          </div>
        </div>
        <p className="time-ago">Hace {timeAgo(incidencia.createdAt)}</p>
      </div>

      
      {isAssigneeInfoModalOpen && createPortal(
        <div className="assignee-info-modal-overlay" onClick={() => setIsAssigneeInfoModalOpen(false)}>
          <div className="assignee-info-modal-content" onClick={(e) => e.stopPropagation()}>
            <h4>Responsable de la Incidencia</h4>
            <p className="assignee-name">{incidencia.assignedTo}</p>
            <div className="modal-actions">
              <button onClick={() => setIsAssigneeInfoModalOpen(false)} className="button-secondary">Cerrar</button>
              {user?.username === incidencia.assignedTo && !isSupervisor && (
                <button onClick={handleReleaseIncidence} className="button-danger">Liberar</button>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Assign Modal for admins */}
      {isAssignModalOpen && (
        <AssignModal
          isOpen={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          mode={assignModalMode}
          currentAssignee={incidencia.assignedTo || undefined}
          onAction={(action, value) => {
            // action: 'add' | 'edit' | 'delete'
            if (action === 'delete') {
              // Unassign (send null to make JSON persistence explicit)
              if (onUpdateStatus) onUpdateStatus(incidencia.id, incidencia.status, null as any);
            } else if (value) {
              // Assign or edit: keep same status, only change assignedTo
              if (onUpdateStatus) onUpdateStatus(incidencia.id, incidencia.status, value);
            }
            setIsAssignModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default IncidenceCardBase;