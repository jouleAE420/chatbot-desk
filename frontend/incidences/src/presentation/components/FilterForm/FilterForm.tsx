import React, { useState, useMemo, useEffect } from 'react';
import './FilterForm.css';
import type { TicketOptions } from '../../../domain/models/incidencia';

//esta interface define las props que el componente FilterForm va a recibir
interface FilterFormProps {
  isVisible: boolean;
  onClose: () => void;
  onApplyFilter: (filters: any) => void;
  currentFilterValues: any;
  incidencias: TicketOptions[]; 
}

//el componente FilterForm es un formulario que permite filtrar las incidencias
const FilterForm: React.FC<FilterFormProps> = ({
  isVisible,
  onClose,
  onApplyFilter,
  currentFilterValues,
  incidencias,
}) => {
  const [filters, setFilters] = useState(currentFilterValues || {});
//sincroniza los filtros actuales con los valores de filtro recibidos por props
  useEffect(() => {
    setFilters(currentFilterValues || {});
  }, [currentFilterValues, isVisible]);
//obtiene los valores unicos de parkingId y ticketType para los dropdowns
  const uniqueParkingIds = useMemo(() => {
    const ids = new Set(incidencias.map(inc => inc.parkingId));
    return Array.from(ids);
  }, [incidencias]);
//obtiene los valores unicos de ticketType para los dropdowns
  const uniqueTicketTypes = useMemo(() => {
    const types = new Set(incidencias.map(inc => inc.ticketType));
    return Array.from(types);
  }, [incidencias]);
//si el formulario no es visible, no renderiza nada. las buenas practicas de la programacion ajajaj
  if (!isVisible) {
    return null;
  }
//maneja los cambios en los inputs del formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev: any) => ({ ...prev, [name]: value }));
  };

  //aplica los filtros y cierra el formulario
  const handleApply = () => {
    onApplyFilter(filters);
  };

//este retturn renderiza el formulario con los dropdowns y botones
  return (
    <div className="filter-form-overlay" onClick={onClose}>
      <div className="filter-form-container" onClick={(e) => e.stopPropagation()}>
        <div className="filter-form-header">
          <h3>Filtrar Incidencias</h3>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        
        <div className="form-group">
          <label htmlFor="parkingId">Proyecto (Parking ID):</label>
          <select
            id="parkingId"
            name="parkingId"
            value={filters.parkingId || ''}
            onChange={handleInputChange}
          >
            <option value="">Todos</option>
            {uniqueParkingIds.map(id => (
              <option key={id} value={id}>{id}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="ticketType">Tipo de Ticket:</label>
          <select
            id="ticketType"
            name="ticketType"
            value={filters.ticketType || ''}
            onChange={handleInputChange}
          >
            <option value="">Todos</option>
            {uniqueTicketTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="clientName">Nombre del Cliente:</label>
          <input
            type="text"
            id="clientName"
            name="clientName"
            value={filters.clientName || ''}
            onChange={handleInputChange}
            placeholder="Buscar por nombre..."
          />
        </div>

        <div className="form-actions">
          <button onClick={handleApply} className="apply-button">Aplicar</button>
        </div>
      </div>
    </div>
  );
};

export default FilterForm;