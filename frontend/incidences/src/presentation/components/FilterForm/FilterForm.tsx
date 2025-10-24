import React, { useState, useMemo, useEffect, useCallback } from 'react';
import './FilterForm.css';
import type { TicketOptions } from '../../../domain/models/incidencia';

type FilterValues = {
  parkingId?: string;
  ticketType?: string;
  assignedTo?: string;
  startDate?: string;
  endDate?: string;
};

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

interface FilterFormProps {
  isVisible: boolean;
  onClose: () => void;
  onApplyFilter: (filters: FilterValues) => void;
  currentFilterValues: FilterValues;
  incidencias: TicketOptions[];
  assignees: string[];
}

const FilterForm: React.FC<FilterFormProps> = ({
  isVisible,
  onClose,
  onApplyFilter,
  currentFilterValues,
  incidencias,
  assignees,
}) => {
  const [filters, setFilters] = useState<FormState>({});

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

  const handleEscapeKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isVisible) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.removeEventListener('keydown', handleEscapeKey);
        document.body.style.overflow = '';
      };
    }
  }, [isVisible, handleEscapeKey]);

  const uniqueParkingIds = useMemo(
    () => Array.from(new Set(incidencias.map(inc => inc.parkingId))), 
    [incidencias]
  );

  const uniqueTicketTypes = useMemo(() => {
    const filtered = filters.parkingId 
      ? incidencias.filter(inc => inc.parkingId === filters.parkingId)
      : incidencias;
    return Array.from(new Set(filtered.map(inc => inc.ticketType)));
  }, [incidencias, filters.parkingId]);

  const uniqueYears = useMemo(() => {
    const years = new Set(
      incidencias
        .map(inc => new Date(inc.createdAt).getFullYear())
        .filter(year => !isNaN(year))
    );
    return Array.from(years).sort((a, b) => b - a);
  }, [incidencias]);

  const months = useMemo(() => 
    Array.from({ length: 12 }, (_, i) => ({
      value: i + 1,
      label: new Date(0, i).toLocaleString('es', { month: 'long' })
    })),
    []
  );

  const days = useMemo(() => Array.from({ length: 31 }, (_, i) => i + 1), []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  }, []);

  const buildDateString = (year?: string, month?: string, day?: string): string => {
    if (!year || !month || !day) return '';
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const handleApply = useCallback(() => {
    const { startDay, startMonth, startYear, endDay, endMonth, endYear, ...rest } = filters;
    
    const finalFilters: FilterValues = {
      parkingId: rest.parkingId || '',
      ticketType: rest.ticketType || '',
      assignedTo: rest.assignedTo || '',
      startDate: buildDateString(startYear, startMonth, startDay),
      endDate: buildDateString(endYear, endMonth, endDay),
    };
    
    onApplyFilter(finalFilters);
  }, [filters, onApplyFilter]);

  const handleClear = useCallback(() => {
    setFilters({});
    onApplyFilter({});
  }, [onApplyFilter]);

  if (!isVisible) return null;

  return (
    <div 
      className="filter-form-overlay" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="filter-title"
    >
      <div className="filter-form-container" onClick={(e) => e.stopPropagation()}>
        <div className="filter-form-header">
          <h3 id="filter-title">Filtrar Incidencias</h3>
          <button 
            onClick={onClose} 
            className="close-button"
            aria-label="Cerrar formulario de filtros"
          >
            &times;
          </button>
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
          <label htmlFor="assignedTo">Responsable:</label>
          <select 
            id="assignedTo" 
            name="assignedTo" 
            value={filters.assignedTo || ''} 
            onChange={handleInputChange}
          >
            <option value="">Todos</option>
            {assignees.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Fecha de Inicio:</label>
          <div className="date-selects">
            <select name="startDay" value={filters.startDay || ''} onChange={handleInputChange}>
              <option value="">Día</option>
              {days.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
            <select name="startMonth" value={filters.startMonth || ''} onChange={handleInputChange}>
              <option value="">Mes</option>
              {months.map(month => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </select>
            <select name="startYear" value={filters.startYear || ''} onChange={handleInputChange}>
              <option value="">Año</option>
              {uniqueYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Fecha de Fin:</label>
          <div className="date-selects">
            <select name="endDay" value={filters.endDay || ''} onChange={handleInputChange}>
              <option value="">Día</option>
              {days.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
            <select name="endMonth" value={filters.endMonth || ''} onChange={handleInputChange}>
              <option value="">Mes</option>
              {months.map(month => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </select>
            <select name="endYear" value={filters.endYear || ''} onChange={handleInputChange}>
              <option value="">Año</option>
              {uniqueYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button 
            onClick={handleClear} 
            className="clear-button"
            aria-label="Limpiar todos los filtros"
          >
            Limpiar Filtros
          </button>
          <button 
            onClick={handleApply} 
            className="apply-button"
            aria-label="Aplicar filtros seleccionados"
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterForm;