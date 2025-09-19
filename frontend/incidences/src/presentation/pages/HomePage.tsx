import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { TicketOptions } from '../../domain/models/incidencia';
import IncidenceColumn from '../components/IncidenceColumn';
import { StatusType } from '../../domain/models/incidencia';
import { DragDropContext, type DropResult } from '@hello-pangea/dnd';
import CategoryToolbar from '../components/CategoryToolbar/CategoryToolbar'; // Importar CategoryToolbar
import FilterForm from '../components/FilterForm/FilterForm'; // Importar FilterForm

interface Props {
  incidencias: TicketOptions[];
  onUpdateStatus: (id: number, newStatus: StatusType) => void;
}

interface ColumnState {
  filterText: string;
  sortOrder: 'asc' | 'desc';
  isFilterFormVisible: boolean;
  currentFilterValues: any; // Nuevo estado para los valores del formulario de filtro
}

const HomePage: React.FC<Props> = ({ incidencias, onUpdateStatus }) => {
  const [columnStates, setColumnStates] = useState<Record<StatusType, ColumnState>>({
    [StatusType.created]: { filterText: '', sortOrder: 'asc', isFilterFormVisible: false, currentFilterValues: {} },
    [StatusType.pending]: { filterText: '', sortOrder: 'asc', isFilterFormVisible: false, currentFilterValues: {} },
    [StatusType.in_progress]: { filterText: '', sortOrder: 'asc', isFilterFormVisible: false, currentFilterValues: {} },
    [StatusType.resolved]: { filterText: '', sortOrder: 'asc', isFilterFormVisible: false, currentFilterValues: {} },
  });

  const handleFilterButtonClick = (status: StatusType) => {
    setColumnStates(prev => ({
      ...prev,
      [status]: { ...prev[status], isFilterFormVisible: !prev[status].isFilterFormVisible },
    }));
  };

  const handleApplyFilter = (status: StatusType, filters: any) => {
    setColumnStates(prev => ({
      ...prev,
      [status]: { ...prev[status], currentFilterValues: filters, isFilterFormVisible: false }, // Cerrar el formulario al aplicar
    }));
  };

  const handleSortChange = (status: StatusType, sortOrder: 'asc' | 'desc') => {
    setColumnStates(prev => ({
      ...prev,
      [status]: { ...prev[status], sortOrder },
    }));
  };

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

          // Aplicar filtros del formulario
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
            filteredIncidencias.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          } else {
            filteredIncidencias.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          }

          return (
            <React.Fragment key={key}>
              <IncidenceColumn
                droppableId={key}
                title={<Link to={`/${key.toLowerCase().replace(/_/g, '-')}`}>{col.title}</Link>}
                toolbar={
                  <CategoryToolbar
                    onFilterButtonClick={() => handleFilterButtonClick(key as StatusType)}
                    onSortChange={(order) => handleSortChange(key as StatusType, order)}
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
                  onClose={() => handleFilterButtonClick(key as StatusType)} // Reutilizamos la función para cerrar
                  onApplyFilter={(filters) => handleApplyFilter(key as StatusType, filters)}
                  currentFilterValues={currentColumnState.currentFilterValues}
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