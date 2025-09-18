import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import type { TicketOptions } from '../../../domain/models/incidencia';
import { StatusType } from '../../../domain/models/incidencia';
import IncidenceCardBase from './IncidenceCardBase';

interface Props {
  incidencia: TicketOptions;
  onUpdateStatus: (id: number, newStatus: StatusType) => void; // This prop is for the context, not the card itself
  index: number;
}

const IncidenceCard: React.FC<Props> = ({ incidencia, index }) => {
  return (
    <Draggable draggableId={incidencia.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <IncidenceCardBase 
            incidencia={incidencia} 
            isDragging={snapshot.isDragging} 
          />
        </div>
      )}
    </Draggable>
  );
};

export default IncidenceCard;