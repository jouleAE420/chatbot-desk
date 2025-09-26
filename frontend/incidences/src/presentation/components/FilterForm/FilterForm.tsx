import React, { useState, useMemo, useEffect } from 'react';
import './FilterForm.css';
import type { TicketOptions } from '../../../domain/models/incidencia';

// Define un tipo para los valores de filtro
type FilterValues = {
  parkingId?: string;
  ticketType?: string;
  assignedTo?: string;
  startDate?: string;
  endDate?: string;
};

// Tipo para el estado interno del formulario
type FormState = {
  parkingId?: string;
  ticketType?: string;
  assignedTo?: string;
  startDay?: string;
  startMonth?: string;
  startYear?: string;
  endDay?: string;
  endMonth?: string;
  endYear?: string;
};
// Define las props que el componente espera recibir
interface FilterFormProps {
  isVisible: boolean;
  onClose: () => void;
  onApplyFilter: (filters: FilterValues) => void;
  currentFilterValues: FilterValues;
  incidencias: TicketOptions[];
  assignees: string[];
}
//componente funcional de react
const FilterForm: React.FC<FilterFormProps> = ({
  isVisible,
  onClose,
  onApplyFilter,
  currentFilterValues,
  incidencias,
  assignees,
}) => {
  const [filters, setFilters] = useState<FormState>({});
//cuando cambian los valores de currentFilterValues y isVisible, actualizamos el estado interno del formulario
  useEffect(() => {
    if (isVisible) {
      const { startDate, endDate, ...rest } = currentFilterValues;
      const [startYear, startMonth, startDay] = startDate?.split('-') || [];
      const [endYear, endMonth, endDay] = endDate?.split('-') || [];
      setFilters({
        ...rest,
        startDay: startDay || '',
        startMonth: startMonth || '',
        startYear: startYear || '',
        endDay: endDay || '',
        endMonth: endMonth || '',
        endYear: endYear || '',
      });
    }
  }, [currentFilterValues, isVisible]);
//usamos useMemo para calcular los valores unicos de parkingId, ticketType y years
  const uniqueParkingIds = useMemo(() => Array.from(new Set(incidencias.map(inc => inc.parkingId))), [incidencias]);
//aqui filtramos los ticketTypes si hay un parkingId seleccionado
  const uniqueTicketTypes = useMemo(() => {
    if (!filters.parkingId) return Array.from(new Set(incidencias.map(inc => inc.ticketType)));
    const filtered = incidencias.filter(inc => inc.parkingId === filters.parkingId);
    return Array.from(new Set(filtered.map(inc => inc.ticketType)));
  }, [incidencias, filters.parkingId]);
//aqui obtenemos los años unicos de las incidencias
  const uniqueYears = useMemo(() => {
    const years = new Set(incidencias.map(inc => new Date(inc.createdAt).getFullYear()).filter(year => !isNaN(year)));
    return Array.from(years).sort((a, b) => b - a);
  }, [incidencias]);
//definimos arrays para los meses y dias
  const months = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: new Date(0, i).toLocaleString('es', { month: 'long' }) }));
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  if (!isVisible) {
    return null;
  }
//funcion para manejar los cambios en los select
  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
//funcion para manejar la aplicacion de filtros
  const handleApply = () => {
    const { startDay, startMonth, startYear, endDay, endMonth, endYear, ...rest } = filters;
    //construimos las fechas en formato YYYY-MM-DD si todos los componentes estan presentes
    const finalFilters: FilterValues = {
        parkingId: rest.parkingId || '',
        ticketType: rest.ticketType || '',
        assignedTo: rest.assignedTo || '',
        startDate: '',
        endDate: ''
    };
// aqui preguntamos si los componentes de la fecha estan completos antes de construir la fecha
    if (startYear && startMonth && startDay) {
      finalFilters.startDate = `${startYear}-${String(startMonth).padStart(2, '0')}-${String(startDay).padStart(2, '0')}`;
    }
  
    if (endYear && endMonth && endDay) {
      finalFilters.endDate = `${endYear}-${String(endMonth).padStart(2, '0')}-${String(endDay).padStart(2, '0')}`;
    }
    
    onApplyFilter(finalFilters);
  };
//funcion para limpiar los filtros
  const handleClear = () => {
    setFilters({});
    onApplyFilter({});
  };
//retornamos el JSX del componente
  return (
    <div className="filter-form-overlay" onClick={onClose}>
      <div className="filter-form-container" onClick={(e) => e.stopPropagation()}>
        <div className="filter-form-header">
          <h3>Filtrar Incidencias</h3>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        
        <div className="form-group">
          <label htmlFor="parkingId">Proyecto (Parking ID):</label>
          <select id="parkingId" name="parkingId" value={filters.parkingId || ''} onChange={handleInputChange}>
            <option value="">Todos</option>
            {uniqueParkingIds.map(id => <option key={id} value={id}>{id}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="ticketType">Tipo de Ticket:</label>
          <select id="ticketType" name="ticketType" value={filters.ticketType || ''} onChange={handleInputChange}>
            <option value="">Todos</option>
            {uniqueTicketTypes.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="assignedTo">Responsable:</label>
          <select id="assignedTo" name="assignedTo" value={filters.assignedTo || ''} onChange={handleInputChange}>
            <option value="">Todos</option>
            {assignees.map(name => <option key={name} value={name}>{name}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>Fecha de Inicio:</label>
          <div className="date-selects">
            <select name="startDay" value={filters.startDay || ''} onChange={handleInputChange}>
              <option value="">Día</option>
              {days.map(day => <option key={day} value={day}>{day}</option>)}
            </select>
            <select name="startMonth" value={filters.startMonth || ''} onChange={handleInputChange}>
              <option value="">Mes</option>
              {months.map(month => <option key={month.value} value={month.value}>{month.label}</option>)}
            </select>
            <select name="startYear" value={filters.startYear || ''} onChange={handleInputChange}>
              <option value="">Año</option>
              {uniqueYears.map(year => <option key={year} value={year}>{year}</option>)}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Fecha de Fin:</label>
          <div className="date-selects">
            <select name="endDay" value={filters.endDay || ''} onChange={handleInputChange}>
              <option value="">Día</option>
              {days.map(day => <option key={day} value={day}>{day}</option>)}
            </select>
            <select name="endMonth" value={filters.endMonth || ''} onChange={handleInputChange}>
              <option value="">Mes</option>
              {months.map(month => <option key={month.value} value={month.value}>{month.label}</option>)}
            </select>
            <select name="endYear" value={filters.endYear || ''} onChange={handleInputChange}>
              <option value="">Año</option>
              {uniqueYears.map(year => <option key={year} value={year}>{year}</option>)}
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button onClick={handleClear} className="clear-button">Limpiar Filtros</button>
          <button onClick={handleApply} className="apply-button">Aplicar</button>
        </div>
      </div>
    </div>
  );
};

export default FilterForm;
