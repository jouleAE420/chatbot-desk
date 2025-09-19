import React, { useState } from 'react';
import './FilterForm.css';


//interface para las props del componente
interface FilterFormProps {
  isVisible: boolean;
  onClose: () => void;
  onApplyFilter: (filters: any) => void; 
  currentFilterValues: any; 
}
//declaramos un const que es el componente
const FilterForm: React.FC<FilterFormProps> = ({
  isVisible,
  onClose,
  onApplyFilter,
  currentFilterValues,
}) => {//aqui definimos los estados iniciales de los filtros
  const [ticketType, setTicketType] = useState(currentFilterValues?.ticketType || '');
  const [clientName, setClientName] = useState(currentFilterValues?.clientName || '');

  if (!isVisible) {
    return null;
  }

  const handleApply = () => {
    onApplyFilter({ ticketType, clientName });
    onClose();
  };

  return (
    <div className="filter-form-overlay">
      <div className="filter-form-container">
        <h3>Filtrar Incidencias</h3>
        <div className="form-group">
          <label htmlFor="ticketType">Tipo de Ticket:</label>
          <input
            type="text"
            id="ticketType"
            value={ticketType}
            onChange={(e) => setTicketType(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="clientName">Nombre del Cliente:</label>
          <input
            type="text"
            id="clientName"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
          />
        </div>
        <div className="form-actions">
          <button onClick={handleApply} className="apply-button">Aplicar</button>
          <button onClick={onClose} className="cancel-button">Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default FilterForm;
