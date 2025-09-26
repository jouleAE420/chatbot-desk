import React, { useState } from 'react';
import { createPortal } from 'react-dom'; // Import createPortal
import { StatusType } from '../../../domain/models/incidencia';
import './StatusActionButtons.css';
import AssignModal from '../AssignModal/AssignModal';

// Define las props que el componente espera recibir
interface Props {
  status: StatusType;
  onMoveClick: (newStatus: StatusType, assignedTo?: string) => void;
  className?: string;
  assignedTo?: string; 
}
//componente funcional de react
const StatusActionButtons: React.FC<Props> = ({ status, onMoveClick, className, assignedTo }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState<StatusType | null>(null);
//funcion que maneja el click para mover el estado
  const handleMoveClick = (newStatus: StatusType) => {
    // si la incidencia esta en "creada" y no tiene asignado a nadie, y se quiere mover a "pendiente" o "en progreso"
    if (status === StatusType.created && !assignedTo && (newStatus === StatusType.pending || newStatus === StatusType.in_progress)) {
      setTargetStatus(newStatus);
      setIsModalOpen(true);
    // si no, simplemente lo movemos, manteniendo el asignado actual
    } else {
      
      onMoveClick(newStatus, assignedTo);
    }
  };
//funcion que maneja las acciones del modal
  const handleModalAction = (action: 'add' | 'edit' | 'delete', value?: string) => {
    //si la accion es "add", y tenemos un valor y un estado objetivo, llamamos a onMoveClick con esos valores
    if (action === 'add' && value && targetStatus) {
      onMoveClick(targetStatus, value);
    }
    //cerramos el modal y reseteamos el estado objetivo
    setIsModalOpen(false);
  
    setTargetStatus(null);
  };
//retornamos el JSX del componente
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

      {createPortal( 
        <AssignModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          mode="add"
          onAction={handleModalAction}
        />,
        document.body 
      )}
    </div>
  );
};

export default StatusActionButtons;