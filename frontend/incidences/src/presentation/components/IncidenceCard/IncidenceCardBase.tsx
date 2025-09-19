import React from 'react';
import type { TicketOptions } from '../../../domain/models/incidencia';
import { StatusType } from '../../../domain/models/incidencia';
import { timeAgo } from '../../utils/date';
import StarRating from '../StarRating';
import StatusActionButtons from '../StatusActionButtons';
import useWindowSize from '../../utils/useWindowSize';
import './IncidenceCard.css';

interface Props {
  incidencia: TicketOptions;
  isDragging?: boolean;
  onUpdateStatus?: (id: number, newStatus: StatusType) => void;
}


//const status options: StatusType[] = ['pending', 'in_progress', 'resolved'];
//const allStatuses = new Set(status options);



const IncidenceCardBase: React.FC<Props> = ({ incidencia, isDragging = false, onUpdateStatus }) => {
  const { width } = useWindowSize(); // uso del hook para obtener el ancho de la ventana
  //parte fundamental para que poder ocultar los botones en pantallas grandes

  const handleMoveClick = (newStatus: StatusType) => {
    if (onUpdateStatus) {
      onUpdateStatus(incidencia.id, newStatus);
    }
  };

  return (

    //este sirve para cambiar el color de la tarjeta dependiendo del status
    <div
      className={`incidencia-card ${incidencia.status} ${isDragging ? 'dragging' : ''}`}
    >

      <div className="card-header">
        <h3>{incidencia.parkingId}</h3>
        <span className="ticket-type">{incidencia.ticketType}</span>
      </div>
      <StarRating rating={incidencia.rate} />
      <p className="time-ago">Hace {timeAgo(incidencia.createdAt)}</p>

      {/* Conditionally render buttons based on screen size */}
      {onUpdateStatus && width && width < 769 && (
        <div onClick={(e) => e.stopPropagation()}>
          <StatusActionButtons status={incidencia.status} onMoveClick={handleMoveClick} />
        </div>
      )}
    </div>
  );
};

export default IncidenceCardBase;