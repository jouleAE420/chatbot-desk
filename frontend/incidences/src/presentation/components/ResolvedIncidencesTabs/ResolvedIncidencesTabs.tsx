import React from 'react';
import { Link } from 'react-router-dom';
import './ResolvedIncidencesTabs.css';

const ResolvedIncidencesTabs: React.FC = () => {
  return (
    <div className="resolved-tabs-container">
      <Link to="/resolved" className="resolved-tab-button">
        Ver Incidencias Resueltas
      </Link>
    </div>
  );
};

export default ResolvedIncidencesTabs;
