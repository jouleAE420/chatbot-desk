import React from 'react';
import './CategoryToolbar.css';
import { IconFilterSearch, IconSortAscending, IconSortDescending, IconRestore } from '@tabler/icons-react';

interface CategoryToolbarProps {
  onFilterButtonClick: () => void;
  onSortChange: (order: 'asc' | 'desc') => void;
  currentSortOrder: 'asc' | 'desc';
  areFiltersApplied: boolean; // New prop
  onClearFilters: () => void; // New prop
}

const CategoryToolbar: React.FC<CategoryToolbarProps> = ({
  onFilterButtonClick,
  onSortChange,
  currentSortOrder,
  areFiltersApplied, // Destructure new prop
  onClearFilters, // Destructure new prop
}) => {
  const toggleSortOrder = () => {
    onSortChange(currentSortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="category-toolbar">
      <button onClick={onFilterButtonClick} className="filter-button">
        <IconFilterSearch stroke={2} />
      </button>
      <button onClick={toggleSortOrder} className="sort-button">
        {currentSortOrder === 'asc' ? <IconSortAscending stroke={2} /> : <IconSortDescending stroke={2} />}
      </button>
      {areFiltersApplied && ( // Conditionally render restore button
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