import React, { useRef } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { useNavigate, useLocation } from 'react-router-dom';
import type { TicketOptions } from '../../../domain/models/incidencia';
import { StatusType } from '../../../domain/models/incidencia';
import IncidenceCardBase from './IncidenceCardBase';
// Define las props que el componente espera recibir
interface Props {
  incidencia: TicketOptions;
  onUpdateStatus: (id: number, newStatus: StatusType, assignedTo?: string) => void;
  index: number;
}
//componente funcional de react
const IncidenceCard: React.FC<Props> = ({ incidencia, index, onUpdateStatus }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const wasDragging = useRef(false);
//returna el JSX que define la estructura visual del componente
  return (
    <Draggable draggableId={incidencia.id.toString()} index={index}>
      {(provided, snapshot) => {
        if (snapshot.isDragging) {
          wasDragging.current = true;
        }
//el div envuelve la tarjeta de incidencia y maneja el click y el arrastre
        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={() => {

// Si el usuario estaba arrastrando, no navegamos
              if (wasDragging.current) {
                wasDragging.current = false;
                return;
              }
              //si no, navegamos a la pagina de detalles de la incidencia
              navigate(`/incidencias/${incidencia.id}`, { state: { from: location.pathname } });
            }}
          >
            <IncidenceCardBase
              incidencia={incidencia}
              isDragging={snapshot.isDragging}
              onUpdateStatus={onUpdateStatus}
            />
          </div>
        );
      }}
    </Draggable>
  );
};

export default IncidenceCard;