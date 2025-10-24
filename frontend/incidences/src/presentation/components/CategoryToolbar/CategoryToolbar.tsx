import React, { useState, useCallback } from 'react'; 
import './CategoryToolbar.css';
import { 
  IconFilterSearch, 
  IconSortAscending, 
  IconSortDescending, 
  IconRestore, 
  IconDotsVertical 
} from '@tabler/icons-react';

interface CategoryToolbarProps {
  onFilterButtonClick: () => void;
  onSortChange: (order: 'asc' | 'desc') => void;
  currentSortOrder: 'asc' | 'desc';
  areFiltersApplied: boolean;
  onClearFilters: () => void;
}

const CategoryToolbar: React.FC<CategoryToolbarProps> = ({
  onFilterButtonClick,
  onSortChange,
  currentSortOrder,
  areFiltersApplied,
  onClearFilters,
}) => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSortOrder = useCallback(() => {
    onSortChange(currentSortOrder === 'asc' ? 'desc' : 'asc');
  }, [currentSortOrder, onSortChange]);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  const handleFilterClick = useCallback(() => {
    onFilterButtonClick();
    closeMobileMenu();
  }, [onFilterButtonClick, closeMobileMenu]);

  const handleSortClick = useCallback(() => {
    toggleSortOrder();
    closeMobileMenu();
  }, [toggleSortOrder, closeMobileMenu]);

  const handleClearClick = useCallback(() => {
    onClearFilters();
    closeMobileMenu();
  }, [onClearFilters, closeMobileMenu]);

  return (
    <div className="category-toolbar">
      <div className="toolbar-wrapper">
        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Abrir menú de opciones"
          aria-expanded={isMobileMenuOpen}
        >
          <IconDotsVertical stroke={2} />
        </button>

        <div className={`toolbar-actions ${isMobileMenuOpen ? 'open' : ''}`}>
          <button 
            onClick={handleFilterClick} 
            className="filter-button"
            aria-label="Filtrar categorías"
          >
            <IconFilterSearch stroke={2} />
            <span>Filtrar</span>
          </button>

          <button 
            onClick={handleSortClick} 
            className="sort-button"
            aria-label={`Ordenar ${currentSortOrder === 'asc' ? 'descendente' : 'ascendente'}`}
          >
            {currentSortOrder === 'asc' ? 
              <IconSortAscending stroke={2} /> : 
              <IconSortDescending stroke={2} />
            }
            <span>Ordenar</span>
          </button>

          {areFiltersApplied && (
            <button
              className="header-icon-button"
              onClick={handleClearClick}
              aria-label="Limpiar filtros aplicados"
            >
              <IconRestore stroke={2} />
              <span>Limpiar</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryToolbar;