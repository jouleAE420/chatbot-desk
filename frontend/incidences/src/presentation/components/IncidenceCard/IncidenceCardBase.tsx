import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { TicketOptions } from '../../../domain/models/incidencia';
import { StatusType } from '../../../domain/models/incidencia'; // Import StatusType
import { timeAgo } from '../../utils/date';
import StarRating from '../StarRating';
import StatusActionButtons from '../StatusActionButtons';
import './IncidenceCard.css';

interface Props {
  incidencia: TicketOptions;
  isDragging?: boolean;
  onUpdateStatus?: (id: number, newStatus: StatusType) => void; // Add optional prop
}



const IncidenceCardBase: React.FC<Props> = ({ incidencia, isDragging = false, onUpdateStatus }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleCardClick = () => {
    navigate(`/incidencias/${incidencia.id}`, { state: { from: location.pathname } });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleMoveClick = (newStatus: StatusType) => {
    if (onUpdateStatus) {
      onUpdateStatus(incidencia.id, newStatus);
    }
  };

  return (
    <div
      className={`incidencia-card ${incidencia.status} ${isDragging ? 'dragging' : ''}`}
    >
      <div className="card-header">
        <h3>{incidencia.parkingId}</h3>
        <span className="ticket-type">{incidencia.ticketType}</span>
      </div>
      <StarRating rating={incidencia.rate} />
      <p className="time-ago">Hace {timeAgo(incidencia.createdAt)}</p>
      
      {/* This button is now controlled by CSS to appear on hover */}
      <button 
        className="action-button-primary" 
        onClick={handleCardClick}
        onMouseDown={handleMouseDown}
      >
        Ver detalles
      </button>

      {onUpdateStatus && (
        <StatusActionButtons status={incidencia.status} onMoveClick={handleMoveClick} />
      )}
    </div>
  );
};

export default IncidenceCardBase;