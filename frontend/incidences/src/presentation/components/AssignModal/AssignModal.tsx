import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { IconUserCog, IconUserX } from '@tabler/icons-react'; // Import Tabler Icons
import './AssignModal.css';

interface AssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'add' | 'view' | 'edit' | 'delete';
  currentAssignee?: string;
  onAction: (action: 'add' | 'edit' | 'delete', value?: string) => void;
}
//componente funcional de react
const AssignModal: React.FC<AssignModalProps> = ({ isOpen, onClose, mode, currentAssignee, onAction }) => {
  const [assignedToName, setAssignedToName] = useState('');
  const [internalMode, setInternalMode] = useState(mode); // Use internal mode for view/edit toggle

  useEffect(() => {
    setInternalMode(mode); 
    if (mode === 'view' || mode === 'edit') {
      setAssignedToName(currentAssignee || '');
    } else {
      setAssignedToName('');
    }
  }, [isOpen, mode, currentAssignee]);
  //si el modal no esta abierto, no renderizamos nada
  if (!isOpen) {
    return null;
  }

  // Lock background scroll when modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);
//esta const gestiona las acciones de confirmacion y cierre del modal
//las cuales dependen del modo en el que se encuentre el modal
  const handleConfirmAction = (action: 'add' | 'edit' | 'delete') => {
    if (action === 'delete') {
      onAction('delete');
    } else if (assignedToName.trim()) {
      onAction(action, assignedToName.trim());
    }
    onClose(); 
  };
//esta funcion maneja la cancelacion y cierre del modal
  const handleCancel = () => {
    setAssignedToName('');
    onClose();
  };
//declaramos una funcion que retorna el contenido del modal
  const renderContent = () => {
    switch (internalMode) {
      case 'add':
        //aqui retornamos el JSX para el modo de agregar
        return (
          <>
            <h3>Asignar Responsable</h3>
            <p>Por favor, introduce el nombre de la persona responsable de esta incidencia.</p>
            <input
              type="text"
              value={assignedToName}
              onChange={(e) => setAssignedToName(e.target.value)}
              placeholder="Nombre del responsable"
              className="assign-modal-input"
            />
            <div className="assign-modal-actions">
              <button onClick={handleCancel} className="assign-modal-button cancel">Cancelar</button>
              <button onClick={() => handleConfirmAction('add')} className="assign-modal-button assign" disabled={!assignedToName.trim()}>Añadir</button>
            </div>
          </>
        );
      case 'view':
        //aqui retornamos el JSX para el modo de ver
        return (
          <>
            <h3>Responsable Asignado</h3>
            <p className="assignee-name">{currentAssignee}</p>
            <div className="assign-modal-actions">
              <button onClick={() => setInternalMode('edit')} className="assign-modal-button edit">
                <IconUserCog stroke={2} size={20} /> Editar
              </button>
              <button onClick={() => setInternalMode('delete')} className="assign-modal-button delete">
                <IconUserX stroke={2} size={20} /> Eliminar
              </button>
            </div>
            <button onClick={handleCancel} className="assign-modal-button cancel-view">Cerrar</button>
          </>
        );
        //aqui retornamos el JSX para el modo de editar
      case 'edit':
        return (
          <>
            <h3>Editar Responsable</h3>
            <p>Modifica el nombre del responsable.</p>
            <input
              type="text"
              value={assignedToName}
              onChange={(e) => setAssignedToName(e.target.value)}
              placeholder="Nombre del responsable"
              className="assign-modal-input"
            />
            <div className="assign-modal-actions">
              <button onClick={() => setInternalMode('view')} className="assign-modal-button cancel">Cancelar</button>
              <button onClick={() => handleConfirmAction('edit')} className="assign-modal-button assign" disabled={!assignedToName.trim()}>Guardar</button>
            </div>
          </>
        );
      case 'delete':
        //aqui retornamos el JSX para el modo de eliminar
        return (
          <>
            <h3>Eliminar Responsable</h3>
            <p>¿Estás seguro de que quieres eliminar a **{currentAssignee}** como responsable de esta incidencia?</p>
            <div className="assign-modal-actions">
              <button onClick={() => handleConfirmAction('delete')} className="assign-modal-button delete-confirm">Confirmar Eliminación</button>
              <button onClick={() => setInternalMode('view')} className="assign-modal-button cancel">Cancelar</button>
            </div>
          </>
        );
      default:
        //aqui retornamos null si no coincide con ningun modo
        return null;
    }
  };
  
//retornamos el JSX del modal
  return createPortal(
    <div className="assign-modal-overlay" onClick={handleCancel}>
      <div className="assign-modal-content" onClick={(e) => e.stopPropagation()}>
        {renderContent()}
      </div>
    </div>,
    document.body
  );
};

export default AssignModal;