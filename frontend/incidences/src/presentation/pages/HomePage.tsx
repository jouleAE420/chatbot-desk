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

interface Props {
  incidencias: TicketOptions[];
  onUpdateStatus: (id: number, newStatus: StatusType, assignedTo?: string) => void;
  columnStates: Record<StatusType | 'all', ColumnState>;
  onFilterButtonClick: (status: StatusType | 'all') => void;
  onApplyFilter: (status: StatusType | 'all', filters: any) => void;
  onSortChange: (status: StatusType | 'all', sortOrder: 'asc' | 'desc') => void;
  onCloseFilterForm: (status: StatusType | 'all') => void;
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
  const [assignmentInfo, setAssignmentInfo] = useState<{ incidence: TicketOptions; newStatus: StatusType } | null>(null);

  const assignees = useMemo(() => 
    Array.from(new Set(incidencias.map(inc => inc.assignedTo).filter((name): name is string => !!name)))
  , [incidencias]);

  const globalColumnState = columnStates.all;
  let processedIncidencias = [...incidencias];

  // Apply global filtering
  if (globalColumnState.currentFilterValues.ticketType) {
    processedIncidencias = processedIncidencias.filter(inc => inc.ticketType.toLowerCase().includes(globalColumnState.currentFilterValues.ticketType.toLowerCase()));
  }
  if (globalColumnState.currentFilterValues.assignedTo) {
    processedIncidencias = processedIncidencias.filter(inc => inc.assignedTo === globalColumnState.currentFilterValues.assignedTo);
  }
  if (globalColumnState.currentFilterValues.startDate) {
    const startDate = new Date(globalColumnState.currentFilterValues.startDate);
    processedIncidencias = processedIncidencias.filter(inc => new Date(inc.createdAt) >= startDate);
  }
  if (globalColumnState.currentFilterValues.endDate) {
    const endDate = new Date(globalColumnState.currentFilterValues.endDate);
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
    [StatusType.created]: { title: 'Creadas', incidencias: processedIncidencias.filter(inc => inc.status === StatusType.created) },
    [StatusType.pending]: { title: 'Pendientes', incidencias: processedIncidencias.filter(inc => inc.status === StatusType.pending) },
    [StatusType.in_progress]: { title: 'En Progreso', incidencias: processedIncidencias.filter(inc => inc.status === StatusType.in_progress) },
    [StatusType.resolved]: {
      title: 'Resueltas',
      incidencias: processedIncidencias
        .filter(inc => inc.status === StatusType.resolved)
        .sort((a, b) => (b.resolvedAt || 0) - (a.resolvedAt || 0))
        .slice(0, 3),
    },
  };

  const onDragStart = () => {
    document.body.classList.add('is-dragging');
  };

  const onDragEnd = (result: DropResult) => {
    document.body.classList.remove('is-dragging');
    const { source, destination, draggableId } = result;

    if (!destination || source.droppableId === destination.droppableId) return;

    const incidenceId = Number(draggableId);
    const movedIncidence = incidencias.find(inc => inc.id === incidenceId);
    if (!movedIncidence) return;

    const newStatus = destination.droppableId as StatusType;
    const sourceStatus = source.droppableId as StatusType;

    if (sourceStatus === StatusType.created && !movedIncidence.assignedTo && (newStatus === StatusType.pending || newStatus === StatusType.in_progress)) {
      setAssignmentInfo({ incidence: movedIncidence, newStatus });
    } else {
      onUpdateStatus(incidenceId, newStatus, movedIncidence.assignedTo);
    }
  };

  const handleModalAction = (action: 'add' | 'edit' | 'delete', value?: string) => {
    if (action === 'add' && value && assignmentInfo) {
      onUpdateStatus(assignmentInfo.incidence.id, assignmentInfo.newStatus, value);
    }
    setAssignmentInfo(null);
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
                  seeMorePath={key === StatusType.resolved ? '/resolved' : undefined}
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
