import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { TicketOptions } from '../../domain/models/incidencia';
import IncidenceColumn from '../components/IncidenceColumn';
import { StatusType } from '../../domain/models/incidencia';
import { DragDropContext, type DropResult } from '@hello-pangea/dnd';
import CategoryToolbar from '../components/CategoryToolbar/CategoryToolbar';
import FilterForm from '../components/FilterForm/FilterForm';
import AssignModal from '../components/AssignModal/AssignModal';
import type { ColumnState } from '../App';
import { useAuth } from '../context/AuthContext';

//definimos las props que el componente espera recibir
interface Props {
  incidencias: TicketOptions[];
  onUpdateStatus: (id: number, newStatus: StatusType, assignedTo?: string) => void;
  columnStates: Record<StatusType | 'all', ColumnState>;
  onFilterButtonClick: (status: StatusType | 'all') => void;
  onApplyFilter: (status: StatusType | 'all', filters: any) => void;
  onSortChange: (status: StatusType | 'all', sortOrder: 'asc' | 'desc') => void;
  onCloseFilterForm: (status: StatusType | 'all') => void;
  onStatisticsClick?: (status: StatusType | 'all') => void; // La hacemos opcional y aceptamos 'all'
}
//componente funcional de react
const HomePage: React.FC<Props> = ({ 
  incidencias, 
  onUpdateStatus,
  columnStates,
  onFilterButtonClick,
  onApplyFilter,
  onSortChange,
  onCloseFilterForm,
  onStatisticsClick
}) => {
  const { user } = useAuth();
  const [assignmentInfo, setAssignmentInfo] = useState<{ incidence: TicketOptions; newStatus: StatusType } | null>(null);
//usamos useMemo para memorizar los asignados unicos
  const assignees = useMemo(() => 
    Array.from(new Set(incidencias.map(inc => inc.assignedTo).filter((name): name is string => !!name)))
  , [incidencias]);
//obtenemos el estado de la columna global
  const globalColumnState = columnStates.all;
  let processedIncidencias = [...incidencias];

  // si hay filtros globales, los aplicamos
  if (globalColumnState.currentFilterValues.ticketType) {
    processedIncidencias = processedIncidencias.filter(inc => inc.ticketType.toLowerCase().includes(globalColumnState.currentFilterValues.ticketType.toLowerCase()));
  }
   //si hay un filtro de assignedTo, lo aplicamos
  if (globalColumnState.currentFilterValues.assignedTo) {
    processedIncidencias = processedIncidencias.filter(inc => inc.assignedTo === globalColumnState.currentFilterValues.assignedTo);
  }
  //si hay un filtro de startDate, lo aplicamos
  if (globalColumnState.currentFilterValues.startDate) {
    const startDate = new Date(globalColumnState.currentFilterValues.startDate);
    processedIncidencias = processedIncidencias.filter(inc => new Date(inc.createdAt) >= startDate);
  }
  //si hay un filtro de endDate, lo aplicamos
  if (globalColumnState.currentFilterValues.endDate) {
    const endDate = new Date(globalColumnState.currentFilterValues.endDate);
    endDate.setHours(23, 59, 59, 999);
    processedIncidencias = processedIncidencias.filter(inc => new Date(inc.createdAt) <= endDate);
  }

//aplicamos el ordenamiento global
  if (globalColumnState.sortOrder === 'asc') {
    processedIncidencias.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  } 
  //sino, ordenamos de forma descendente
  else {
    processedIncidencias.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
//aqui se definen las columnas y las incidencias que contienen
  const columns: { [key in StatusType]: { title: string; incidencias: TicketOptions[] } } = {
    [StatusType.created]: { title: 'Creadas', incidencias: processedIncidencias.filter(inc => inc.status === StatusType.created).slice(0, 5) },
    [StatusType.pending]: { title: 'Pendientes', incidencias: processedIncidencias.filter(inc => inc.status === StatusType.pending) },
    [StatusType.in_progress]: { title: 'En Progreso', incidencias: processedIncidencias.filter(inc => inc.status === StatusType.in_progress).slice(0, 5) },
    [StatusType.resolved]: {
      title: 'Resueltas',
      incidencias: processedIncidencias
        .filter(inc => inc.status === StatusType.resolved)
        .sort((a, b) => (b.resolvedAt || 0) - (a.resolvedAt || 0))
        .slice(0, 5),
    },
  };
//esta funcion maneja el inicio del arrastre
  const onDragStart = () => {
    document.body.classList.add('is-dragging');
  };
//esta funcion maneja el final del arrastre
  const onDragEnd = (result: DropResult) => {
    // Quitamos la clase de arrastre del body
    document.body.classList.remove('is-dragging');
    // Si no hay destino, o el destino es el mismo que el origen, no hacemos nada
    const { source, destination, draggableId } = result;

//si no hay destino, o el destino es el mismo que el origen, no hacemos nada
    if (!destination || source.droppableId === destination.droppableId) return;
//obtenemos la incidencia que se ha movido
    const incidenceId = Number(draggableId);
    //aqui declaramos movedIncidence para encontrar la incidencia que se ha movido
    const movedIncidence = incidencias.find(inc => inc.id === incidenceId);
    //aqui si la incidencia no se encuentra, no hacemos nada
    if (!movedIncidence) return;
//obtenemos el nuevo estado y el estado de origen
    const newStatus = destination.droppableId as StatusType;
    //aqui declaramos sourceStatus para obtener el estado de origen
    const sourceStatus = source.droppableId as StatusType;
//si el estado no ha cambiado, no hacemos nada
    if (sourceStatus === StatusType.created && !movedIncidence.assignedTo && (newStatus === StatusType.pending || newStatus === StatusType.in_progress)) {
      setAssignmentInfo({ incidence: movedIncidence, newStatus });
    }
    //si el estado ha cambiado, actualizamos el estado de la incidencia 
    else {
      onUpdateStatus(incidenceId, newStatus, movedIncidence.assignedTo);
    }
  };
//esta funcion maneja las acciones del modal de asignacion
  const handleModalAction = (action: 'add' | 'edit' | 'delete', value?: string) => {
    //si la accion es agregar y hay un valor y una informacion de asignacion, actualizamos el estado de la incidencia
    if (action === 'add' && value && assignmentInfo) {
      onUpdateStatus(assignmentInfo.incidence.id, assignmentInfo.newStatus, value);
    }
    setAssignmentInfo(null);
  };
//el return retorna el JSX que define la estructura visual del componente
  return (
    <>
      {globalColumnState.isFilterFormVisible && (
        <FilterForm
          isVisible={globalColumnState.isFilterFormVisible}
          onClose={() => onCloseFilterForm('all')}
          onApplyFilter={(filters) => onApplyFilter('all', filters)}
          currentFilterValues={globalColumnState.currentFilterValues}
          incidencias={incidencias}
          assignees={assignees}
        />
      )}

      {assignmentInfo && (
        <AssignModal
          isOpen={!!assignmentInfo}
          onClose={() => setAssignmentInfo(null)}
          mode="add"
          onAction={handleModalAction}
        />
      )}

      <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <div className="columns-container">
          {Object.entries(columns).map(([key, col]) => {
            const currentColumnState = columnStates[key as StatusType];
            let filteredIncidencias = col.incidencias;

            // Apply individual column filtering
            if (currentColumnState.currentFilterValues.ticketType) {
              filteredIncidencias = filteredIncidencias.filter(inc => inc.ticketType.toLowerCase().includes(currentColumnState.currentFilterValues.ticketType.toLowerCase()));
            }
            if (currentColumnState.currentFilterValues.assignedTo) {
              filteredIncidencias = filteredIncidencias.filter(inc => inc.assignedTo === currentColumnState.currentFilterValues.assignedTo);
            }
            if (currentColumnState.currentFilterValues.startDate) {
              const startDate = new Date(currentColumnState.currentFilterValues.startDate);
              filteredIncidencias = filteredIncidencias.filter(inc => new Date(inc.createdAt) >= startDate);
            }
            if (currentColumnState.currentFilterValues.endDate) {
              const endDate = new Date(currentColumnState.currentFilterValues.endDate);
              endDate.setHours(23, 59, 59, 999);
              filteredIncidencias = filteredIncidencias.filter(inc => new Date(inc.createdAt) <= endDate);
            }

            // Apply individual column sorting
            if (currentColumnState.sortOrder === 'asc') {
              filteredIncidencias = [...filteredIncidencias].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            } else {
              filteredIncidencias = [...filteredIncidencias].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            }
//retornamos el JSX que define la estructura visual del componente
            return (
              <React.Fragment key={key}>
                <IncidenceColumn
                  droppableId={key}
                  title={<Link to={`/${key.toLowerCase().replace(/_/g, '-')}`}>{col.title}</Link>}
                  toolbar={
                    <CategoryToolbar
                      onFilterButtonClick={() => onFilterButtonClick(key as StatusType | 'all')}
                      onSortChange={(order) => onSortChange(key as StatusType | 'all', order)}
                      currentSortOrder={currentColumnState.sortOrder}
                      areFiltersApplied={Object.keys(currentColumnState.currentFilterValues).length > 0} 
                      onClearFilters={() => onApplyFilter(key as StatusType | 'all', {})}
                    />
                  }
                  incidencias={filteredIncidencias}
                  columnClass={key.toLowerCase().replace(/_/g, '-')}
                  onUpdateStatus={onUpdateStatus}
                  seeMorePath={`/${key.toLowerCase().replace(/_/g, '-')}`}
                  onStatisticsClick={onStatisticsClick ? () => onStatisticsClick(key as StatusType) : undefined}
                />
                {currentColumnState.isFilterFormVisible && (
                  <FilterForm
                    isVisible={currentColumnState.isFilterFormVisible}
                    onClose={() => onCloseFilterForm(key as StatusType)}
                    onApplyFilter={(filters) => onApplyFilter(key as StatusType, filters)}
                    currentFilterValues={currentColumnState.currentFilterValues}
                    incidencias={incidencias}
                    assignees={assignees}
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
