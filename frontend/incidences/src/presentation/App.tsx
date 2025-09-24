import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import type { TicketOptions } from '../domain/models/incidencia';
import { StatusType } from '../domain/models/incidencia';
import { getAllIncidencias, updateIncidenciaStatus } from '../application/services/incidencias.service';
import HomePage from './pages/HomePage';
import StatusPage from './pages/StatusPage';
import IncidenceDetailPage from './pages/IncidenceDetailPage';
import ResolvedDashboardPage from './pages/ResolvedDashboardPage'; 
import Header from './components/Header';

export type ColumnState = {
  filterText: string;
  sortOrder: 'asc' | 'desc';
  isFilterFormVisible: boolean;
  currentFilterValues: any;
};

function App() {
  const [incidencias, setIncidencias] = useState<TicketOptions[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const marginTop = location.pathname === '/' ? '60px' : '80px';

  const [columnStates, setColumnStates] = useState<Record<StatusType | 'all', ColumnState>>({
    [StatusType.created]: { filterText: '', sortOrder: 'asc', isFilterFormVisible: false, currentFilterValues: {} },
    [StatusType.pending]: { filterText: '', sortOrder: 'asc', isFilterFormVisible: false, currentFilterValues: {} },
    [StatusType.in_progress]: { filterText: '', sortOrder: 'asc', isFilterFormVisible: false, currentFilterValues: {} },
    [StatusType.resolved]: { filterText: '', sortOrder: 'asc', isFilterFormVisible: false, currentFilterValues: {} },
    all: { filterText: '', sortOrder: 'asc', isFilterFormVisible: false, currentFilterValues: {} },
  });

  const handleFilterButtonClick = (status: StatusType | 'all') => {
    setColumnStates(prev => ({ ...prev, [status]: { ...prev[status], isFilterFormVisible: !prev[status].isFilterFormVisible } }));
  };

  const handleCloseFilterForm = (status: StatusType | 'all') => {
    setColumnStates(prev => ({ ...prev, [status]: { ...prev[status], isFilterFormVisible: false } }));
  };

  const handleApplyFilter = (status: StatusType | 'all', filters: any) => {
    setColumnStates(prev => ({ ...prev, [status]: { ...prev[status], currentFilterValues: filters, isFilterFormVisible: false } }));
  };

  const handleSortChange = (status: StatusType | 'all', sortOrder: 'asc' | 'desc') => {
    setColumnStates(prev => ({ ...prev, [status]: { ...prev[status], sortOrder } }));
  };

  useEffect(() => {
    const loadIncidencias = async () => {
      try {
        const data = await getAllIncidencias();
        const sortedData = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setIncidencias(sortedData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadIncidencias();
  }, []);

  const handleUpdateStatus = async (id: number, newStatus: StatusType, assignedTo?: string) => {
    try {
      const updatedIncidencia = await updateIncidenciaStatus(id, newStatus, assignedTo);
      setIncidencias(prev => prev.map(inc => inc.id === updatedIncidencia.id ? updatedIncidencia : inc));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="App">
      <Header 
        columnStates={columnStates}
        onFilterButtonClick={handleFilterButtonClick}
        onSortChange={handleSortChange}
        onApplyFilter={handleApplyFilter}
      />
      {loading ? (
        <p>Cargando incidencias...</p>
      ) : (
        <main style={{ marginTop: marginTop }}>
          <Routes>
            <Route 
              path="/" 
              element={
                <HomePage 
                  incidencias={incidencias} 
                  onUpdateStatus={handleUpdateStatus}
                  columnStates={columnStates}
                  onFilterButtonClick={handleFilterButtonClick}
                  onApplyFilter={handleApplyFilter}
                  onSortChange={handleSortChange}
                  onCloseFilterForm={handleCloseFilterForm}
                />
              } 
            />
            <Route 
              path="/resolved"
              element={<ResolvedDashboardPage incidencias={incidencias} />}
            />
            <Route 
              path="/:statusKey" 
              element={
                <StatusPage 
                  incidencias={incidencias} 
                  onUpdateStatus={handleUpdateStatus} 
                  columnStates={columnStates}
                  onFilterButtonClick={handleFilterButtonClick}
                  onApplyFilter={handleApplyFilter}
                  onSortChange={handleSortChange}
                  onCloseFilterForm={handleCloseFilterForm}
                />
              } 
            />
            <Route 
              path="/incidencias/:id" 
              element={<IncidenceDetailPage incidencias={incidencias} onUpdateStatus={handleUpdateStatus} />} 
            />
          </Routes>
        </main>
      )}
    </div>
  );
}

export default App;
