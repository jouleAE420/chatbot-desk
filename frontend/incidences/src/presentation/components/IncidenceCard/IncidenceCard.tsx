import React, { useRef } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { useNavigate, useLocation } from 'react-router-dom';
import type { TicketOptions } from '../../../domain/models/incidencia';
import { StatusType } from '../../../domain/models/incidencia';
import IncidenceCardBase from './IncidenceCardBase';

interface Props {
  incidencia: TicketOptions;
  onUpdateStatus: (id: number, newStatus: StatusType) => void;
  index: number;
}

const IncidenceCard: React.FC<Props> = ({ incidencia, index, onUpdateStatus }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const wasDragging = useRef(false);

  return (
    <Draggable draggableId={incidencia.id.toString()} index={index}>
      {(provided, snapshot) => {
        if (snapshot.isDragging) {
          wasDragging.current = true;
        }

        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={() => {
              // If the card was dragged, reset the ref and do nothing
              if (wasDragging.current) {
                wasDragging.current = false;
                return;
              }
              // Otherwise, it's a click, so navigate
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