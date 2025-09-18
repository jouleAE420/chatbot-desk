import React from 'react';
import { Link } from 'react-router-dom';
import type { TicketOptions } from '../../domain/models/incidencia';
import IncidenceColumn from '../components/IncidenceColumn';
import { StatusType } from '../../domain/models/incidencia';
import { DragDropContext, type DropResult } from '@hello-pangea/dnd';

interface Props {
  incidencias: TicketOptions[];
  onUpdateStatus: (id: number, newStatus: StatusType) => void;
}

const HomePage: React.FC<Props> = ({ incidencias, onUpdateStatus }) => {
  const columns: { [key in StatusType]: { title: string; incidencias: TicketOptions[] } } = {
    [StatusType.created]: {
      title: 'Creadas',
      incidencias: incidencias.filter(inc => inc.status === StatusType.created),
    },
    [StatusType.pending]: {
      title: 'Pendientes',
      incidencias: incidencias.filter(inc => inc.status === StatusType.pending),
    },
    [StatusType.in_progress]: {
      title: 'En Progreso',
      incidencias: incidencias.filter(inc => inc.status === StatusType.in_progress),
    },
    [StatusType.resolved]: {
      title: 'Resueltas',
      incidencias: incidencias.filter(inc => inc.status === StatusType.resolved),
    },
  };

  const onDragStart = () => {
    document.body.classList.add('is-dragging');
  };

  const onDragEnd = (result: DropResult) => {
    document.body.classList.remove('is-dragging');
    const { source, destination, draggableId } = result;

    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      return;
    }

    const newStatus = destination.droppableId as StatusType;
    onUpdateStatus(Number(draggableId), newStatus);
  };

  return (
    <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <div className="columns-container">
        {Object.entries(columns).map(([key, col]) => (
          <IncidenceColumn
            key={key}
            droppableId={key}
            title={<Link to={`/${key.toLowerCase().replace(/_/g, '-')}`}>{col.title}</Link>}
            incidencias={col.incidencias}
            columnClass={key.toLowerCase().replace(/_/g, '-')}
            onUpdateStatus={onUpdateStatus}
          />
        ))}
      </div>
    </DragDropContext>
  );
};

export default HomePage;
