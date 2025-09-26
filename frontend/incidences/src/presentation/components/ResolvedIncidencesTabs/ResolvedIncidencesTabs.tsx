import React from 'react';
import { Link } from 'react-router-dom';
import './ResolvedIncidencesTabs.css';

// el const define el componente ResolvedIncidencesTabs
const ResolvedIncidencesTabs: React.FC = () => {
  //returna el JSX que define la estructura visual del componente
  return (
    
    <div className="resolved-tabs-container">
      <Link to="/resolved" className="resolved-tab-button">
        Ver Incidencias Resueltas
      </Link>
    </div>
  );
};

export default ResolvedIncidencesTabs;
