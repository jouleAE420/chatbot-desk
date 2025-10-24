import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import './ConfirmationModal.css';

interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  children: React.ReactNode;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  title, 
  children 
}) => {
  const handleEscapeKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel();
    }
  }, [onCancel]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.removeEventListener('keydown', handleEscapeKey);
        document.body.style.overflow = '';
      };
    }
  }, [isOpen, handleEscapeKey]);

  if (!isOpen) return null;

  return createPortal(
    <div 
      className="confirmation-modal-overlay" 
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className="confirmation-modal-content" 
        onClick={(e) => e.stopPropagation()}
      >
        <h4 id="modal-title">{title}</h4>
        <div className="confirmation-modal-body">
          {children}
        </div>
        <div className="confirmation-modal-actions">
          <button 
            onClick={onCancel} 
            className="button-cancel"
            aria-label="Cancelar acción"
          >
            Cancelar
          </button>
          <button 
            onClick={onConfirm} 
            className="button-confirm"
            aria-label="Confirmar acción"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmationModal;