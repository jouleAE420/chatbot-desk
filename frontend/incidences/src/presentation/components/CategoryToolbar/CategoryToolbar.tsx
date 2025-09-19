import React from 'react';
import './CategoryToolbar.css';

interface CategoryToolbarProps {
  onFilterButtonClick: () => void; // Nueva prop para el clic del botón de filtro
  onSortChange: (order: 'asc' | 'desc') => void;
  currentSortOrder: 'asc' | 'desc';
  // currentFilterText ya no es necesario aquí
}

const CategoryToolbar: React.FC<CategoryToolbarProps> = ({
  onFilterButtonClick, // Nueva prop
  onSortChange,
  currentSortOrder,
}) => {
  const toggleSortOrder = () => {
    onSortChange(currentSortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="category-toolbar">
      <button onClick={onFilterButtonClick} className="filter-button">
        🔍
      </button>
      <button onClick={toggleSortOrder} className="sort-button">
        {currentSortOrder === 'asc' ? '⬆️' : '⬇️'}
      </button>
    </div>
  );
};

export default CategoryToolbar;