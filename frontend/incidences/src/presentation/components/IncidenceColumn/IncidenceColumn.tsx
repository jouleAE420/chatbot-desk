import React from 'react';
import { Link } from 'react-router-dom';
import type { TicketOptions } from '../../../domain/models/incidencia';
import { StatusType } from '../../../domain/models/incidencia';
import IncidenceCard from '../IncidenceCard';
import './IncidenceColumn.css';
import { Droppable } from '@hello-pangea/dnd';
import { IconChecklist, IconChartBar } from '@tabler/icons-react'; // Import the icon
// Define las props que el componente espera recibir
interface Props {
  title: React.ReactNode;
  toolbar: React.ReactNode;
  incidencias: TicketOptions[];
  columnClass: string;
  onUpdateStatus: (id: number, newStatus: StatusType, assignedTo?: string) => void;
  droppableId: string;
  seeMorePath?: string;
  onStatisticsClick?: () => void; // Changed to optional
}
//componente funcional de react
const IncidenceColumn: React.FC<Props> = ({ title, toolbar, incidencias, columnClass, onUpdateStatus, droppableId, seeMorePath, onStatisticsClick }) => {
  //returna el JSX que define la estructura visual del componente
  return (
    <div className={`status-column ${columnClass}`}>
      <h2 className="column-title">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          {title}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {toolbar}
            {onStatisticsClick && (
              <button onClick={onStatisticsClick} className="header-icon-button" title="Ver estadísticas">
                  <IconChartBar stroke={2} />
              </button>
            )}
          </div>
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
            {seeMorePath && (
              <Link to={seeMorePath} className="see-more-link">
                <IconChecklist stroke={2} size={18} />
                <span>Ver más...</span>
              </Link>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default IncidenceColumn;