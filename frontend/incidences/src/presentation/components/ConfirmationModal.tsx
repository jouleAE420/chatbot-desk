import React from 'react';
import { createPortal } from 'react-dom';
import './ConfirmationModal.css';

interface Props {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  children: React.ReactNode;
}

const ConfirmationModal: React.FC<Props> = ({ isOpen, onConfirm, onCancel, title, children }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="confirmation-modal-overlay" onClick={onCancel}>
      <div className="confirmation-modal-content" onClick={(e) => e.stopPropagation()}>
        <h4>{title}</h4>
        <div className="confirmation-modal-body">
          {children}
        </div>
        <div className="confirmation-modal-actions">
          <button onClick={onCancel} className="button-cancel">Cancelar</button>
          <button onClick={onConfirm} className="button-confirm">Confirmar</button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmationModal;
