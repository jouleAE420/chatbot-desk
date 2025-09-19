import React from 'react';
import './CategoryToolbar.css';
import { IconFilterSearch } from '@tabler/icons-react';
import { IconSortAscending } from '@tabler/icons-react';
import { IconSortDescending } from '@tabler/icons-react';

interface CategoryToolbarProps {
  onFilterButtonClick: () => void; //esto sirve para abrir el modal
  onSortChange: (order: 'asc' | 'desc') => void;
  currentSortOrder: 'asc' | 'desc';
}

const CategoryToolbar: React.FC<CategoryToolbarProps> = ({
  onFilterButtonClick, //nuecva prop
  onSortChange,
  currentSortOrder,
}) => {
  const toggleSortOrder = () => { //funcion para cambiar el orden de los tickets
    onSortChange(currentSortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    //retorna los botones de filtro y orden
    <div className="category-toolbar">
      <button onClick={onFilterButtonClick} className="filter-button">
<IconFilterSearch stroke={2} />      </button>
      <button onClick={toggleSortOrder} className="sort-button">
        {currentSortOrder === 'asc' ? <IconSortAscending stroke={2} /> : <IconSortDescending stroke={2} />}
      </button>
    </div>
  );
};

export default CategoryToolbar;