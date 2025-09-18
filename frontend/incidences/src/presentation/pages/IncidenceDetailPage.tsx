import React from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { BackButton } from '../components/BackButton';
import type { TicketOptions } from '../../domain/models/incidencia';
import { StatusType } from '../../domain/models/incidencia';
import StatusActionButtons from '../components/StatusActionButtons';
import '../components/IncidenceCard/IncidenceCard.css'; // Import CSS for button styles
import './IncidenceDetailPage.css';

interface Props {
  incidencias: TicketOptions[];
  onUpdateStatus: (id: number, newStatus: StatusType) => void;
}

const IncidenceDetailPage: React.FC<Props> = ({ incidencias, onUpdateStatus }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const incidencia = incidencias.find(inc => inc.id === parseInt(id || ''));

  const handleMoveClick = (newStatus: StatusType) => {
    if (onUpdateStatus && incidencia) {
      onUpdateStatus(incidencia.id, newStatus);
      navigate('/'); // Navigate back to the main board after updating
    }
  };

  if (!incidencia) {
    return (
      <div className="incidence-detail-page">
        <h2>Incidencia no encontrada</h2>
        <Link to="/" className="back-link">Volver al panel</Link>
      </div>
    );
  }

  return (
    <div className="incidence-detail-page">
      <BackButton />
      <h2>Detalles del Ticket #{incidencia.id}</h2>
      {/* Move Actions */}
      <StatusActionButtons status={incidencia.status} onMoveClick={handleMoveClick} className="detail-page-actions" />
      <div className="detail-content">
        <p><strong>Proyecto (Parking ID):</strong> {incidencia.parkingId}</p>
        <p><strong>Cliente:</strong> {incidencia.clientName}</p>
        <p><strong>Origen Teléfono:</strong> {incidencia.phoneOrigin}</p>
        <p><strong>Tipo de Ticket:</strong> {incidencia.ticketType}</p>
        <p><strong>Calificación:</strong> {incidencia.rate}</p>
        <p><strong>Comentario:</strong> {incidencia.comment}</p>
        <p><strong>Estado:</strong> {incidencia.status}</p>
        <p><strong>Creada:</strong> {new Date(incidencia.createdAt).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default IncidenceDetailPage;