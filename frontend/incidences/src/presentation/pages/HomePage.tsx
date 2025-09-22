import React from 'react'; // Removed useState
import { Link } from 'react-router-dom';
import type { TicketOptions } from '../../domain/models/incidencia';
import IncidenceColumn from '../components/IncidenceColumn';
import { StatusType } from '../../domain/models/incidencia';
import { DragDropContext, type DropResult } from '@hello-pangea/dnd';
import CategoryToolbar from '../components/CategoryToolbar/CategoryToolbar';
import FilterForm from '../components/FilterForm/FilterForm';
import type { ColumnState } from '../App'; // Import ColumnState from App

interface Props {
  incidencias: TicketOptions[];
  onUpdateStatus: (id: number, newStatus: StatusType) => void;
  // Props passed down from App
  columnStates: Record<StatusType, ColumnState>;
  onFilterButtonClick: (status: StatusType) => void;
  onApplyFilter: (status: StatusType, filters: any) => void;
  onSortChange: (status: StatusType, sortOrder: 'asc' | 'desc') => void;
  onCloseFilterForm: (status: StatusType) => void;
}

const HomePage: React.FC<Props> = ({ 
  incidencias, 
  onUpdateStatus,
  columnStates,
  onFilterButtonClick,
  onApplyFilter,
  onSortChange
}) => {
  // All local state and handlers are removed

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
        {Object.entries(columns).map(([key, col]) => {
          const currentColumnState = columnStates[key as StatusType];
          let filteredIncidencias = col.incidencias;

          // This filtering logic remains, but uses the state from props
          if (currentColumnState.currentFilterValues.ticketType) {
            filteredIncidencias = filteredIncidencias.filter(inc =>
              inc.ticketType.toLowerCase().includes(currentColumnState.currentFilterValues.ticketType.toLowerCase())
            );
          }
          if (currentColumnState.currentFilterValues.clientName) {
            filteredIncidencias = filteredIncidencias.filter(inc =>
              inc.clientName.toLowerCase().includes(currentColumnState.currentFilterValues.clientName.toLowerCase())
            );
          }

          if (currentColumnState.sortOrder === 'asc') {
            filteredIncidencias = [...filteredIncidencias].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          } else {
            filteredIncidencias = [...filteredIncidencias].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          }

          return (
            <React.Fragment key={key}>
              <IncidenceColumn
                droppableId={key}
                title={<Link to={`/${key.toLowerCase().replace(/_/g, '-')}`}>{col.title}</Link>}
                toolbar={
                  <CategoryToolbar
                    onFilterButtonClick={() => onFilterButtonClick(key as StatusType)}
                    onSortChange={(order) => onSortChange(key as StatusType, order)}
                    currentSortOrder={currentColumnState.sortOrder}
                  />
                }
                incidencias={filteredIncidencias}
                columnClass={key.toLowerCase().replace(/_/g, '-')}
                onUpdateStatus={onUpdateStatus}
              />
              {currentColumnState.isFilterFormVisible && (
                <FilterForm
                  isVisible={currentColumnState.isFilterFormVisible}
                  onClose={() => onCloseFilterForm(key as StatusType)} // Use the new handler
                  onApplyFilter={(filters) => onApplyFilter(key as StatusType, filters)}
                  currentFilterValues={currentColumnState.currentFilterValues}
                  incidencias={incidencias} // Pass down the full list
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default HomePage;