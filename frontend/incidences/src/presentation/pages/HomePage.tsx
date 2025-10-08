import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { TicketOptions } from '../../domain/models/incidencia';
import IncidenceColumn from '../components/IncidenceColumn';
import { StatusType } from '../../domain/models/incidencia';
import { DragDropContext, type DropResult } from '@hello-pangea/dnd';
import CategoryToolbar from '../components/CategoryToolbar/CategoryToolbar';
import FilterForm from '../components/FilterForm/FilterForm';
import type { ColumnState } from '../App';
import { useAuth } from '../context/AuthContext';
import ConfirmationModal from '../components/ConfirmationModal';

interface Props {
  incidencias: TicketOptions[];
  onUpdateStatus: (id: number, newStatus: StatusType, assignedTo?: string) => void;
  columnStates: Record<StatusType | 'all', ColumnState>;
  onFilterButtonClick: (status: StatusType | 'all') => void;
  onApplyFilter: (status: StatusType | 'all', filters: any) => void;
  onSortChange: (status: StatusType | 'all', sortOrder: 'asc' | 'desc') => void;
  onCloseFilterForm: (status: StatusType | 'all') => void;
  onStatisticsClick?: (status: StatusType | 'all') => void;
}

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
  const [pendingAction, setPendingAction] = useState<{ action: () => void; message: React.ReactNode } | null>(null);

  const assignees = useMemo(() => 
    Array.from(new Set(incidencias.map(inc => inc.assignedTo).filter((name): name is string => !!name)))
  , [incidencias]);

  const globalColumnState = columnStates.all;
  let processedIncidencias = [...incidencias];

  // Global filters and sort logic...

  const columns = useMemo(() => {
    const processedIncidencias = [...incidencias];
    // Global filters and sort logic could be applied here if needed
    
    return {
      [StatusType.created]: {
        title: 'Creadas',
        incidencias: processedIncidencias.filter(inc => inc.status === StatusType.created).slice(0, 4),
      },
      [StatusType.pending]: {
        title: 'Pendientes',
        incidencias: processedIncidencias.filter(inc => inc.status === StatusType.pending && (user?.role === 'admin' || user?.role === 'supervisor' || inc.assignedTo === user?.username)).slice(0, 6),
      },
      [StatusType.in_progress]: {
        title: 'En Progreso',
        incidencias: processedIncidencias.filter(inc => inc.status === StatusType.in_progress && (user?.role === 'admin' || user?.role === 'supervisor' || inc.assignedTo === user?.username)).slice(0, 4),
      },
      [StatusType.resolved]: {
        title: 'Resueltas',
        incidencias: processedIncidencias
          .filter(inc => inc.status === StatusType.resolved)
          .sort((a, b) => (b.resolvedAt || 0) - (a.resolvedAt || 0))
          .slice(0, 4),
      },
    };
  }, [incidencias, user]);

  const columnOrder: StatusType[] = [StatusType.created, StatusType.pending, StatusType.in_progress, StatusType.resolved];

  const onDragStart = () => {
    document.body.classList.add('is-dragging');
  };

  const handleUpdateStatusWithConfirmation = (id: number, newStatus: StatusType, currentAssignee?: string) => {
    const incidence = incidencias.find(inc => inc.id === id);
    if (!incidence) return;

    const isAssigningFromCreated = incidence.status === StatusType.created && 
                                   (newStatus === StatusType.pending || newStatus === StatusType.in_progress) &&
                                   !incidence.assignedTo;

    if (isAssigningFromCreated) {
      setPendingAction({
        message: `¿Confirmas que quieres asignarte esta incidencia y moverla a "${newStatus}"?`,
        action: () => onUpdateStatus(id, newStatus, user?.username)
      });
    } else {
      onUpdateStatus(id, newStatus, currentAssignee);
    }
  };

  const onDragEnd = (result: DropResult) => {
    document.body.classList.remove('is-dragging');
    const { source, destination, draggableId } = result;

    if (!destination || source.droppableId === destination.droppableId) return;

    const incidenceId = Number(draggableId);
    const movedIncidence = incidencias.find(inc => inc.id === incidenceId);
    if (!movedIncidence) return;

    const newStatus = destination.droppableId as StatusType;
    
    handleUpdateStatusWithConfirmation(incidenceId, newStatus, movedIncidence.assignedTo);
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

      <ConfirmationModal
        isOpen={!!pendingAction}
        title="Confirmar Acción"
        onConfirm={() => {
          pendingAction?.action();
          setPendingAction(null);
        }}
        onCancel={() => setPendingAction(null)}
      >
        {pendingAction?.message}
      </ConfirmationModal>

      <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <div className="columns-container">
          {columnOrder.map((key) => {
            const col = columns[key];
            const currentColumnState = columnStates[key as StatusType];
            let filteredIncidencias = col.incidencias;

            // Individual column filtering and sorting logic...

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
                  onUpdateStatus={handleUpdateStatusWithConfirmation}
                  seeMorePath={`/${key.toLowerCase().replace(/_/g, '-')}`}
                  onStatisticsClick={
                    onStatisticsClick && key !== StatusType.pending
                      ? () => onStatisticsClick(key as StatusType)
                      : undefined
                  }
                />
                {/* ... */}
              </React.Fragment>
            );
          })}
        </div>
      </DragDropContext>
    </>
  );
};

export default HomePage;