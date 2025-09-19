import React from 'react';
import type { TicketOptions } from '../../../domain/models/incidencia';
import { StatusType } from '../../../domain/models/incidencia';
import IncidenceCard from '../IncidenceCard';
import './IncidenceColumn.css';
import { Droppable } from '@hello-pangea/dnd';

interface Props {
  title: React.ReactNode;
  toolbar: React.ReactNode; // Nueva prop para la barra de herramientas
  incidencias: TicketOptions[];
  columnClass: string;
  onUpdateStatus: (id: number, newStatus: StatusType) => void;
  droppableId: string;
}

const IncidenceColumn: React.FC<Props> = ({ title, toolbar, incidencias, columnClass, onUpdateStatus, droppableId }) => {
  return (
    <div className={`status-column ${columnClass}`}>
      <h2 className="column-title">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          {title}
          {toolbar}
        </div>
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