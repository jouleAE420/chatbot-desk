import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { BackButton } from '../components/BackButton';
import { GenericBackButton } from '../components/GenericBackButton'; 
import type { TicketOptions } from '../../domain/models/incidencia';
import { StatusType } from '../../domain/models/incidencia';
import StatusActionButtons from '../components/StatusActionButtons';
import StarRating from '../components/StarRating';
import { timeAgo } from '../utils/date';
import useWindowSize from '../utils/useWindowSize';
import './IncidenceDetailPage.css';
import { useAuth } from '../context/AuthContext';
import ConfirmationModal from '../components/ConfirmationModal';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';


interface Props {
  incidencias: TicketOptions[];
  onUpdateStatus: (id: number, newStatus: StatusType, assignedTo?: string) => void;
}

// Sub-component for status badge
const StatusBadge: React.FC<{ status: StatusType }> = ({ status }) => {
  return <span className={`status-badge ${status.toLowerCase()}`}>{status}</span>;
};

const IncidenceDetailPage: React.FC<Props> = ({ incidencias, onUpdateStatus }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate(); // CORREGIDO
  const location = useLocation(); // CORREGIDO
  const { width } = useWindowSize();

  const { user } = useAuth();
  const [pendingAction, setPendingAction] = useState<{ action: () => void; message: React.ReactNode } | null>(null);
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

  // --- LÓGICA DE NAVEGACIÓN CONTEXTUAL ---
  let relevantIncidences = incidencia
    ? incidencias.filter(i => i.status === incidencia.status)
    : [];

  if (user?.role === 'operador' && incidencia) {
    if (incidencia.status === StatusType.created) {
      relevantIncidences = relevantIncidences.filter(inc => !inc.assignedTo);
    } else {
      relevantIncidences = relevantIncidences.filter(inc => inc.assignedTo === user.id);
    }
  }

  const currentIndex = incidencia
    ? relevantIncidences.findIndex(inc => inc.id === incidencia.id)
    : -1;

  const previousIncidence = currentIndex > 0 ? relevantIncidences[currentIndex - 1] : null;
  const nextIncidence = currentIndex < relevantIncidences.length - 1 ? relevantIncidences[currentIndex + 1] : null;

  const fromPath = (location.state as { from?: string })?.from;


  const navigateToIncidence = (targetId?: number) => {
    if (targetId) {
      // Al navegar entre incidencias, pasamos el estado 'from' original
      // para que el botón "Volver" siga funcionando correctamente.
      navigate(`/incidencias/${targetId}`, { state: { from: fromPath } });
    }
  };





  const handleUpdateStatusWithConfirmation = (newStatus: StatusType) => {
    if (!incidencia) return;

    const isAssigningFromCreated = 
      incidencia.status === StatusType.created &&
      (newStatus === StatusType.pending || newStatus === StatusType.in_progress) &&
      !incidencia.assignedTo &&
      user?.role === 'operador';

    if (isAssigningFromCreated) {
      setPendingAction({
        message: `¿Confirmas que quieres asignarte esta incidencia y moverla a "${newStatus}"?`,
        action: () => {
          onUpdateStatus(incidencia.id, newStatus, user?.id);
          navigate('/');
        }
      });
    } else {
      onUpdateStatus(incidencia.id, newStatus, incidencia.assignedTo);
      navigate('/');
    }
  };

  if (!incidencia) {
    return (
      <div className="incidence-detail-page not-found">
        <h2>Incidencia no encontrada</h2>
        <GenericBackButton to="/" text="Volver al panel" />
      </div>
    );
  }

  return (
    <div className="incidence-detail-page">
      <ConfirmationModal
        isOpen={!!pendingAction}
        title="Confirmar Acción"
        onConfirm={() => {
          pendingAction?.action();
          setPendingAction(null);
        }}
        onCancel={() => setPendingAction(null)}
      >
        {pendingAction?.message}
      </ConfirmationModal>

      <div className="detail-header">
        <BackButton />
        <div className="header-content">
          <h2>{incidencia.parkingId}</h2>
          <p>Creada hace {timeAgo(incidencia.createdAt)}</p>
        </div>
    <div className="header-actions">
          {width && width >= 768 && ( // Conditionally render for desktop
            <StatusActionButtons 
              status={incidencia.status} 
              onMoveClick={handleUpdateStatusWithConfirmation} 
            />
          )}
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
                <StarRating rating={incidencia.rate || 0} />
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

       <div className="mobile-actions-bar">
        <StatusActionButtons 
          status={incidencia.status} 
          onMoveClick={handleUpdateStatusWithConfirmation} 
        />
      </div>

      {previousIncidence && (
        <button 
          className="nav-button prev" 
          onClick={() => navigateToIncidence(previousIncidence.id)}
          title="Incidencia Anterior"
        >
          <IconChevronLeft size={32} />
        </button>
      )}
      {nextIncidence && (
        <button 
          className="nav-button next" 
          onClick={() => navigateToIncidence(nextIncidence.id)}
          title="Siguiente Incidencia"
        >
          <IconChevronRight size={32} />
        </button>
      )}


    </div>
  );
};

export default IncidenceDetailPage;