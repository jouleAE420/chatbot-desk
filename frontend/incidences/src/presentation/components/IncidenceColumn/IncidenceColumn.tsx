import React from 'react';
import type { TicketOptions } from '../../../domain/models/incidencia';
import { StatusType } from '../../../domain/models/incidencia';
import IncidenceCard from '../IncidenceCard';
import './IncidenceColumn.css';
import { Droppable } from '@hello-pangea/dnd';

interface Props {
  title: React.ReactNode;
  incidencias: TicketOptions[];
  columnClass: string;
  onUpdateStatus: (id: number, newStatus: StatusType) => void;
  droppableId: string;
}

const IncidenceColumn: React.FC<Props> = ({ title, incidencias, columnClass, onUpdateStatus, droppableId }) => {
  return (
    <div className={`status-column ${columnClass}`}>
      <h2 className="column-title">
        {title}
      </h2>
      <Droppable droppableId={droppableId}>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className="incidences-list-container">
            {incidencias.map((incidencia, index) => (
              <IncidenceCard
                key={incidencia.id}
                incidencia={incidencia}
                onUpdateStatus={onUpdateStatus}
                index={index}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default IncidenceColumn;