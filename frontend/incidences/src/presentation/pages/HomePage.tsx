import React from 'react'; // Removed useState
import { Link } from 'react-router-dom';
import type { TicketOptions } from '../../domain/models/incidencia';
import IncidenceColumn from '../components/IncidenceColumn';
import { StatusType } from '../../domain/models/incidencia';
import { DragDropContext, type DropResult } from '@hello-pangea/dnd';
import CategoryToolbar from '../components/CategoryToolbar/CategoryToolbar';
import FilterForm from '../components/FilterForm/FilterForm';
import ResolvedIncidencesTabs from '../components/ResolvedIncidencesTabs/ResolvedIncidencesTabs'; // Import new component
import type { ColumnState } from '../App'; // Import ColumnState from App

interface Props {
  incidencias: TicketOptions[];
  onUpdateStatus: (id: number, newStatus: StatusType) => void;
  // Props passed down from App
  columnStates: Record<StatusType | 'all', ColumnState>; // Updated to include 'all'
  onFilterButtonClick: (status: StatusType | 'all') => void; // Updated to include 'all'
  onApplyFilter: (status: StatusType | 'all', filters: any) => void; // Updated to include 'all'
  onSortChange: (status: StatusType | 'all', sortOrder: 'asc' | 'desc') => void; // Updated to include 'all'
  onCloseFilterForm: (status: StatusType | 'all') => void; // Updated to include 'all'
}

const HomePage: React.FC<Props> = ({ 
  incidencias, 
  onUpdateStatus,
  columnStates,
  onFilterButtonClick,
  onApplyFilter,
  onSortChange,
  onCloseFilterForm
}) => {
  // All local state and handlers are removed

  const globalColumnState = columnStates.all;
  let processedIncidencias = [...incidencias]; // Start with a copy of all incidences

  // Apply global filtering
  if (globalColumnState.currentFilterValues.ticketType) {
    processedIncidencias = processedIncidencias.filter(inc =>
      inc.ticketType.toLowerCase().includes(globalColumnState.currentFilterValues.ticketType.toLowerCase())
    );
  }
  if (globalColumnState.currentFilterValues.clientName) {
    processedIncidencias = processedIncidencias.filter(inc =>
      inc.clientName.toLowerCase().includes(globalColumnState.currentFilterValues.clientName.toLowerCase())
    );
  }
  if (globalColumnState.currentFilterValues.startDate) {
    const startDate = new Date(globalColumnState.currentFilterValues.startDate);
    processedIncidencias = processedIncidencias.filter(inc => new Date(inc.createdAt) >= startDate);
  }
  if (globalColumnState.currentFilterValues.endDate) {
    const endDate = new Date(globalColumnState.currentFilterValues.endDate);
    // Set end date to the end of the day
    endDate.setHours(23, 59, 59, 999);
    processedIncidencias = processedIncidencias.filter(inc => new Date(inc.createdAt) <= endDate);
  }

  // Apply global sorting
  if (globalColumnState.sortOrder === 'asc') {
    processedIncidencias.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  } else {
    processedIncidencias.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  const columns: { [key in StatusType]: { title: string; incidencias: TicketOptions[] } } = {
    [StatusType.created]: {
      title: 'Creadas',
      incidencias: processedIncidencias.filter(inc => inc.status === StatusType.created),
    },
    [StatusType.pending]: {
      title: 'Pendientes',
      incidencias: processedIncidencias.filter(inc => inc.status === StatusType.pending),
    },
    [StatusType.in_progress]: {
      title: 'En Progreso',
      incidencias: processedIncidencias.filter(inc => inc.status === StatusType.in_progress),
    },
    [StatusType.resolved]: {
      title: 'Resueltas',
      incidencias: processedIncidencias.filter(inc => inc.status === StatusType.resolved),
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
    <>
      {globalColumnState.isFilterFormVisible && (
        <FilterForm
          isVisible={globalColumnState.isFilterFormVisible}
          onClose={() => onCloseFilterForm('all')}
          onApplyFilter={(filters) => onApplyFilter('all', filters)}
          currentFilterValues={globalColumnState.currentFilterValues}
          incidencias={incidencias}
        />
      )}
      <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <div className="columns-container">
          {Object.entries(columns).map(([key, col]) => {
            const currentColumnState = columnStates[key as StatusType];
            let filteredIncidencias = col.incidencias;

            // Apply individual column filtering
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
            if (currentColumnState.currentFilterValues.startDate) {
              const startDate = new Date(currentColumnState.currentFilterValues.startDate);
              filteredIncidencias = filteredIncidencias.filter(inc => new Date(inc.createdAt) >= startDate);
            }
            if (currentColumnState.currentFilterValues.endDate) {
              const endDate = new Date(currentColumnState.currentFilterValues.endDate);
              // Set end date to the end of the day
              endDate.setHours(23, 59, 59, 999);
              filteredIncidencias = filteredIncidencias.filter(inc => new Date(inc.createdAt) <= endDate);
            }

            // Apply individual column sorting
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
                      areFiltersApplied={Object.keys(currentColumnState.currentFilterValues).length > 0}
                      onClearFilters={() => onApplyFilter(key as StatusType, {})}
                    />
                  }
                  incidencias={filteredIncidencias}
                  columnClass={key.toLowerCase().replace(/_/g, '-')}
                  onUpdateStatus={onUpdateStatus}
                />
                {currentColumnState.isFilterFormVisible && ( // Use individual column state for filter form visibility
                  <FilterForm
                    isVisible={currentColumnState.isFilterFormVisible}
                    onClose={() => onCloseFilterForm(key as StatusType)} // Close individual filter form
                    onApplyFilter={(filters) => onApplyFilter(key as StatusType, filters)} // Apply individual filter
                    currentFilterValues={currentColumnState.currentFilterValues}
                    incidencias={incidencias} // Pass down the full list
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </DragDropContext>
    </>
  );
};

export default HomePage;