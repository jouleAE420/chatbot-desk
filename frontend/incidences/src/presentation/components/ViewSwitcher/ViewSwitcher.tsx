import React from 'react';
import { Link } from 'react-router-dom';
import { IconLayoutKanban, IconChartBar } from '@tabler/icons-react';
import './ViewSwitcher.css';

interface ViewSwitcherProps {
  isKanbanView: boolean;
  isDashboardView: boolean;
}

const ViewSwitcher: React.FC<ViewSwitcherProps> = ({ isKanbanView, isDashboardView }) => {
  const activeView = isDashboardView ? 'dashboard' : 'kanban';

  return (
    <div className="view-switcher-container" data-active-view={activeView}>
      <div className="switch-highlight"></div>
      <Link to="/" className={`switch-option ${isKanbanView ? 'active' : ''}`} title="Vista Kanban">
        <IconLayoutKanban stroke={2} />
      </Link>
      <Link to="/dashboard/general" className={`switch-option ${isDashboardView ? 'active' : ''}`} title="Vista Dashboard">
        <IconChartBar stroke={2} />
      </Link>
    </div>
  );
};

export default ViewSwitcher;
