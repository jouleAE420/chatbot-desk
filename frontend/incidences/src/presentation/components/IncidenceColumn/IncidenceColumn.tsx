import React from 'react';
import { Link } from 'react-router-dom';
import type { TicketOptions } from '../../../domain/models/incidencia';
import { StatusType } from '../../../domain/models/incidencia';
import IncidenceCard from '../IncidenceCard';
import './IncidenceColumn.css';
import { Droppable } from '@hello-pangea/dnd';
import { IconChecklist, IconChartBar } from '@tabler/icons-react';

interface Props {
  title: React.ReactNode;
  toolbar: React.ReactNode;
  incidencias: TicketOptions[];
  columnClass: string;
  onUpdateStatus: (id: number, newStatus: StatusType, assignedTo?: string) => void;
  droppableId: string;
  seeMorePath?: string;
  onStatisticsClick?: () => void;
}

const IncidenceColumn: React.FC<Props> = ({ 
  title, 
  toolbar, 
  incidencias, 
  columnClass, 
  onUpdateStatus, 
  droppableId, 
  seeMorePath, 
  onStatisticsClick 
}) => {
  return (
    <div className={`status-column ${columnClass}`}>
      {/* Header */}
      <div className="column-header">
        <h2 className="column-title">{title}</h2>
        <div className="column-actions">
          {toolbar}
          {onStatisticsClick && (
            <button 
              onClick={onStatisticsClick} 
              className="stats-button" 
              title="Ver estadísticas"
              aria-label="Ver estadísticas"
            >
              <IconChartBar stroke={2} size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Droppable List */}
      <Droppable droppableId={droppableId}>
        {(provided, snapshot) => (
          <div 
            {...provided.droppableProps} 
            ref={provided.innerRef} 
            className="incidences-list-container"
            data-is-dragging-over={snapshot.isDraggingOver}
          >
            {incidencias.map((incidencia, index) => (
              <IncidenceCard
                key={incidencia.id}
                incidencia={incidencia}
                onUpdateStatus={onUpdateStatus}
                index={index}
              />
            ))}
            {provided.placeholder}
            
            {/* See More Link */}
            {seeMorePath && incidencias.length > 0 && (
              <Link to={seeMorePath} className="see-more-link">
                <span>Ver más</span>
                <IconChecklist stroke={2} size={18} />
              </Link>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default IncidenceColumn;