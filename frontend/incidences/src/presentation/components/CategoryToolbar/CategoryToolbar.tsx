import React from 'react';
import './CategoryToolbar.css';
import { IconFilterSearch, IconSortAscending, IconSortDescending, IconRestore } from '@tabler/icons-react';

// Define las props que el componente espera recibir
interface CategoryToolbarProps {
  onFilterButtonClick: () => void;
  onSortChange: (order: 'asc' | 'desc') => void;
  currentSortOrder: 'asc' | 'desc';
  areFiltersApplied: boolean; 
  onClearFilters: () => void; 
}
//componente funcional de react
const CategoryToolbar: React.FC<CategoryToolbarProps> = ({
  onFilterButtonClick,
  onSortChange,
  currentSortOrder,
  areFiltersApplied, 
  onClearFilters, 
}) => {
  //funcion para alternar el orden de clasificacion, llama a onSortChange con el orden opuesto
  const toggleSortOrder = () => {
    onSortChange(currentSortOrder === 'asc' ? 'desc' : 'asc');
  };
//returna el JSX que define la estructura visual del componente
  return (
    <div className="category-toolbar">
      <button onClick={onFilterButtonClick} className="filter-button">
        <IconFilterSearch stroke={2} />
      </button>
      <button onClick={toggleSortOrder} className="sort-button">
        {currentSortOrder === 'asc' ? <IconSortAscending stroke={2} /> : <IconSortDescending stroke={2} />}
      </button>
      {areFiltersApplied && ( 
        <button 
          className="header-icon-button" 
          title="Limpiar filtros"
          onClick={onClearFilters}>
          <IconRestore stroke={2} />
        </button>
      )}
    </div>
  );
};

export default CategoryToolbar;