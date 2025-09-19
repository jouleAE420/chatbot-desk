import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { BackButton } from '../components/BackButton';
import type { TicketOptions } from '../../domain/models/incidencia';
import { StatusType } from '../../domain/models/incidencia';
import StatusActionButtons from '../components/StatusActionButtons';
import StarRating from '../components/StarRating';
import { timeAgo } from '../utils/date';
import useWindowSize from '../utils/useWindowSize';
import './IncidenceDetailPage.css';

interface Props {
  incidencias: TicketOptions[];
  onUpdateStatus: (id: number, newStatus: StatusType) => void;
}

// Sub-component for status badge
const StatusBadge: React.FC<{ status: StatusType }> = ({ status }) => {
  return <span className={`status-badge ${status.toLowerCase()}`}>{status}</span>;
};

const IncidenceDetailPage: React.FC<Props> = ({ incidencias, onUpdateStatus }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { width } = useWindowSize();

  const [isCommentExpanded, setCommentExpanded] = useState(true);
  const [isDetailsExpanded, setDetailsExpanded] = useState(true);

  useEffect(() => {
    if (width && width < 768) {
      setDetailsExpanded(false); // Collapse details by default on mobile
    } else {
      setDetailsExpanded(true); // Expand details on desktop
    }
  }, [width]);

  const incidencia = incidencias.find(inc => inc.id === parseInt(id || ''));

  const handleMoveClick = (newStatus: StatusType) => {
    if (onUpdateStatus && incidencia) {
      onUpdateStatus(incidencia.id, newStatus);
      navigate('/');
    }
  };

  if (!incidencia) {
    return (
      <div className="incidence-detail-page not-found">
        <h2>Incidencia no encontrada</h2>
        <Link to="/" className="back-link">Volver al panel</Link>
      </div>
    );
  }

  return (
    <div className="incidence-detail-page">
      <div className="detail-header">
        <BackButton />
        <div className="header-content">
          <h2>{incidencia.parkingId}</h2>
          <p>Creada hace {timeAgo(incidencia.createdAt)}</p>
        </div>
        <div className="header-actions">
          <StatusActionButtons 
            status={incidencia.status} 
            onMoveClick={handleMoveClick} 
          />
        </div>
      </div>

      <div className="detail-body">
        <div className="main-content">
          <div className="card">
            <h3 
              className="collapsible-header" 
              onClick={() => setCommentExpanded(!isCommentExpanded)}
            >
              Comentario
            </h3>
            <div className={`collapsible-content ${isCommentExpanded ? 'expanded' : ''}`}>
              <p>{incidencia.comment || 'No hay comentario.'}</p>
            </div>
          </div>
        </div>

        <div className="sidebar">
          <div className="card">
            <h3 
              className="collapsible-header"
              onClick={() => setDetailsExpanded(!isDetailsExpanded)}
            >
              Detalles
            </h3>
            <div className={`collapsible-content ${isDetailsExpanded ? 'expanded' : ''}`}>
              <div className="detail-item">
                <strong>Estado:</strong>
                <StatusBadge status={incidencia.status} />
              </div>
              <div className="detail-item">
                <strong>Calificación:</strong>
                <StarRating rating={incidencia.rate} />
              </div>
              <div className="detail-item">
                <strong>Proyecto:</strong>
                <span>{incidencia.parkingId}</span>
              </div>
              <div className="detail-item">
                <strong>Ticket ID:</strong>
                <span>#{incidencia.id}</span>
              </div>
              <div className="detail-item">
                <strong>Tipo de Ticket:</strong>
                <span>{incidencia.ticketType}</span>
              </div>
              <div className="detail-item">
                <strong>Cliente:</strong>
                <span>{incidencia.clientName}</span>
              </div>
              <div className="detail-item">
                <strong>Origen:</strong>
                <span>{incidencia.phoneOrigin}</span>
              </div>
              <div className="detail-item">
                <strong>Creada:</strong>
                <span>{new Date(incidencia.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-only floating action bar */}
      <div className="mobile-actions-bar">
        <StatusActionButtons 
          status={incidencia.status} 
          onMoveClick={handleMoveClick} 
        />
      </div>
    </div>
  );
};

export default IncidenceDetailPage;