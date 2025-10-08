import React, { useRef } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { useNavigate, useLocation } from 'react-router-dom';
import type { TicketOptions } from '../../../domain/models/incidencia';
import IncidenceCardBase from './IncidenceCardBase';
import { useAuth } from '../../context/AuthContext';

interface Props {
  incidencia: TicketOptions;
  onUpdateStatus: (id: number, newStatus: any, assignedTo?: string) => void;
  index: number;
}

const IncidenceCard: React.FC<Props> = ({ incidencia, index, onUpdateStatus }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const wasDragging = useRef(false);
  const { user } = useAuth();

  const isDragDisabled = user?.role === 'supervisor';

  return (
    <Draggable draggableId={incidencia.id.toString()} index={index} isDragDisabled={isDragDisabled}>
      {(provided, snapshot) => {
        if (snapshot.isDragging) {
          wasDragging.current = true;
        }
        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={{
              ...provided.draggableProps.style,
              ...(isDragDisabled ? { cursor: 'not-allowed' } : {}),
            }}
            onClick={() => {
              if (wasDragging.current) {
                wasDragging.current = false;
                return;
              }
              navigate(`/incidencias/${incidencia.id}`, { state: { from: location.pathname } });
            }}
          >
            <IncidenceCardBase
              incidencia={incidencia}
              isDragging={snapshot.isDragging}
              onUpdateStatus={onUpdateStatus}
            />
          </div>
        );
      }}
    </Draggable>
  );
};

export default IncidenceCard;