import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import type { TicketOptions } from '../domain/models/incidencia';
import { StatusType } from '../domain/models/incidencia';
import { getAllIncidencias, updateIncidenciaStatus } from '../application/services/incidencias.service';
import HomePage from './pages/HomePage';
import StatusPage from './pages/StatusPage';
import IncidenceDetailPage from './pages/IncidenceDetailPage';
import Header from './components/Header';

// State structure for sorting and filtering
export interface ColumnState {
  filterText: string;
  sortOrder: 'asc' | 'desc';
  isFilterFormVisible: boolean;
  currentFilterValues: any;
}

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
    all: { filterText: '', sortOrder: 'asc', isFilterFormVisible: false, currentFilterValues: {} }, // Global state
  });

  // Toggles form visibility (for header button)
  const handleFilterButtonClick = (status: StatusType | 'all') => {
    setColumnStates(prev => {
      if (status === 'all') {
        // Toggle visibility for the global filter form
        return {
          ...prev,
          all: { ...prev.all, isFilterFormVisible: !prev.all.isFilterFormVisible },
        };
      } else {
        return {
          ...prev,
          [status]: { ...prev[status], isFilterFormVisible: !prev[status].isFilterFormVisible },
        };
      }
    });
  };

  // Explicitly closes the form (for 'X' button or overlay click)
  const handleCloseFilterForm = (status: StatusType | 'all') => {
    setColumnStates(prev => {
      if (status === 'all') {
        return {
          ...prev,
          all: { ...prev.all, isFilterFormVisible: false },
        };
      } else {
        return {
          ...prev,
          [status]: { ...prev[status], isFilterFormVisible: false },
        };
      }
    });
  };

  // Applies filter and closes the form
  const handleApplyFilter = (status: StatusType | 'all', filters: any) => {
    setColumnStates(prev => {
      if (status === 'all') {
        // Apply global filter to all columns
        const newColumnStates = { ...prev };
        Object.values(StatusType).forEach(st => {
          newColumnStates[st] = { ...newColumnStates[st], currentFilterValues: filters };
        });
        newColumnStates.all = { ...newColumnStates.all, currentFilterValues: filters, isFilterFormVisible: false };
        return newColumnStates;
      } else {
        return {
          ...prev,
          [status]: { ...prev[status], currentFilterValues: filters, isFilterFormVisible: false },
        };
      }
    });
  };

  const handleSortChange = (status: StatusType | 'all', sortOrder: 'asc' | 'desc') => {
    setColumnStates(prev => {
      if (status === 'all') {
        // Apply global sort to all columns
        const newColumnStates = { ...prev };
        Object.values(StatusType).forEach(st => {
          newColumnStates[st] = { ...newColumnStates[st], sortOrder: sortOrder };
        });
        newColumnStates.all = { ...newColumnStates.all, sortOrder: sortOrder };
        return newColumnStates;
      } else {
        return {
          ...prev,
          [status]: { ...prev[status], sortOrder },
        };
      }
    });
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

  const handleUpdateStatus = async (id: number, newStatus: StatusType) => {
    try {
      const updatedIncidencia = await updateIncidenciaStatus(id, newStatus);
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