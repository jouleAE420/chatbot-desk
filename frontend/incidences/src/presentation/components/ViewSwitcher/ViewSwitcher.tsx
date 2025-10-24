import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IconLayoutKanban, IconChartBar } from '@tabler/icons-react';
import './ViewSwitcher.css';

const ViewSwitcher: React.FC = () => {
  const location = useLocation();
  
  const isKanbanView = location.pathname === '/';
  const isDashboardView = location.pathname.startsWith('/dashboard');
  const activeView = isDashboardView ? 'dashboard' : 'kanban';

  return (
    <div 
      className="view-switcher-container" 
      data-active-view={activeView}
      role="group"
      aria-label="Selector de vista"
    >
      <div className="switch-highlight" aria-hidden="true" />
      
      <Link 
        to="/" 
        className={`switch-option ${isKanbanView ? 'active' : ''}`}
        aria-label="Cambiar a vista Kanban"
        aria-current={isKanbanView ? 'page' : undefined}
      >
        <IconLayoutKanban stroke={2} />
      </Link>
      
      <Link 
        to="/dashboard/general" 
        className={`switch-option ${isDashboardView ? 'active' : ''}`}
        aria-label="Cambiar a vista Dashboard"
        aria-current={isDashboardView ? 'page' : undefined}
      >
        <IconChartBar stroke={2} />
      </Link>
    </div>
  );
};

export default ViewSwitcher;