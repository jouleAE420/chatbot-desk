import { useState, useEffect, useMemo } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import type { TicketOptions } from '../domain/models/incidencia';
import { StatusType } from '../domain/models/incidencia';
import { getAllIncidencias, updateIncidenciaStatus } from '../application/services/incidencias.service';
import HomePage from './pages/HomePage';
import StatusPage from './pages/StatusPage';
import IncidenceDetailPage from './pages/IncidenceDetailPage';
import ResolvedDashboardPage from './pages/ResolvedDashboardPage';
import GeneralDashboardPage from './pages/GeneralDashboardPage';
import Header from './components/Header';
import StatusDashboardPage from './pages/StatusDashboardPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import { useAuth } from './context/AuthContext';

//este export va aqui porque lo usan varios componentes
export type ColumnState = {
  filterText: string;
  sortOrder: 'asc' | 'desc';
  isFilterFormVisible: boolean;
  currentFilterValues: any;
  currentPage: number;
};
//la funcion App es el componente principal de la aplicacion
//el cual sirve como contenedor de todos los demas componentes
//y maneja el estado global de la aplicacion
//ademas de definir las rutas principales de la aplicacion
//y manejar la logica de negocio principal
function App() {
  const [incidencias, setIncidencias] = useState<TicketOptions[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth(); // Obtenemos el usuario completo desde el contexto
  const marginTop = location.pathname === '/' ? '60px' : '80px';
  const showHeader = location.pathname !== '/login';

  const assignees = useMemo(() => {
    const allAssignees = incidencias
      .map(inc => inc.assignedTo)
      .filter((assignee): assignee is string => !!assignee);
    return Array.from(new Set(allAssignees));
  }, [incidencias]);

  // Verificamos si el usuario tiene permiso para ver los dashboards
  const canViewDashboards = user?.role === 'admin' || user?.role === 'supervisor';

  const [columnStates, setColumnStates] = useState<Record<StatusType | 'all', ColumnState>>({
    [StatusType.created]: { filterText: '', sortOrder: 'asc', isFilterFormVisible: false, currentFilterValues: {}, currentPage: 1 },
    [StatusType.pending]: { filterText: '', sortOrder: 'asc', isFilterFormVisible: false, currentFilterValues: {}, currentPage: 1 },
    [StatusType.in_progress]: { filterText: '', sortOrder: 'asc', isFilterFormVisible: false, currentFilterValues: {}, currentPage: 1 },
    [StatusType.resolved]: { filterText: '', sortOrder: 'asc', isFilterFormVisible: false, currentFilterValues: {}, currentPage: 1 },
    all: { filterText: '', sortOrder: 'asc', isFilterFormVisible: false, currentFilterValues: {}, currentPage: 1 },
  });

  const handlePageChange = (status: StatusType, newPage: number) => {
    setColumnStates(prev => ({ ...prev, [status]: { ...prev[status], currentPage: newPage } }));
  };

//esta funcion maneja la apertura del modal de estadisticas
  const handleOpenStatisticsModal = (status: StatusType | 'all') => {
    const from = location.pathname;
    if (status === 'all') {
      navigate('/dashboard/general', { state: { from } });
    } else {
      navigate(`/dashboard/${status}`, { state: { from } });
    }
  };
//esta funcion maneja el clic en el boton de filtro
  const handleFilterButtonClick = (status: StatusType | 'all') => {
    setColumnStates(prev => ({ ...prev, [status]: { ...prev[status], isFilterFormVisible: !prev[status].isFilterFormVisible } }));
  };
//esta funcion maneja el cierre del formulario de filtro
  const handleCloseFilterForm = (status: StatusType | 'all') => {
    setColumnStates(prev => ({ ...prev, [status]: { ...prev[status], isFilterFormVisible: false } }));
  };
//esta funcion maneja la aplicacion de los filtros
  const handleApplyFilter = (status: StatusType | 'all', filters: any) => {
    setColumnStates(prev => ({ ...prev, [status]: { ...prev[status], currentFilterValues: filters, isFilterFormVisible: false } }));
  };
//esta funcion maneja el cambio de ordenamiento
  const handleSortChange = (status: StatusType | 'all', sortOrder: 'asc' | 'desc') => {
    setColumnStates(prev => ({ ...prev, [status]: { ...prev[status], sortOrder } }));
  };
//este useEffect se encarga de cargar las incidencias desde el servicio
  useEffect(() => {
    //definimos una funcion asincrona para cargar las incidencias
    const loadIncidencias = async () => {
      setLoading(true);
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
//si el usuario esta autenticado, cargamos las incidencias
    if (isAuthenticated) {
      loadIncidencias();
    }
    //si no, limpiamos las incidencias y dejamos de cargar
    else {
      setIncidencias([]);
      setLoading(false);
    }
    //el efecto se vuelve a ejecutar cuando cambia isAuthenticated
  }, [isAuthenticated]);

  //esta funcion maneja la actualizacion del estado de una incidencia
  const handleUpdateStatus = async (id: number, newStatus: StatusType, assignedTo?: string) => {
    //actualizamos el estado de la incidencia en el backend
    try {
      const updatedIncidencia = await updateIncidenciaStatus(id, newStatus, assignedTo);
      setIncidencias(prev => prev.map(inc => inc.id === updatedIncidencia.id ? updatedIncidencia : inc));
    } catch (error) {
      console.error(error);
    }
  };
//el return retorna el JSX que define la estructura visual del componente
  return (
    <div className="App">
      {showHeader && (
        <Header
          columnStates={columnStates}
          onFilterButtonClick={handleFilterButtonClick}
          onSortChange={handleSortChange}
          onApplyFilter={handleApplyFilter}
          // Pasamos la función solo si el usuario tiene permisos
          onStatisticsClick={canViewDashboards ? handleOpenStatisticsModal : undefined}
        />
      )}
      <main style={{ marginTop: showHeader ? marginTop : '0' }}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route 
              path="/" 
              element={
                loading ? <p>Cargando incidencias...</p> : 
                <HomePage 
                  incidencias={incidencias} 
                  onUpdateStatus={handleUpdateStatus}
                  columnStates={columnStates}
                  onFilterButtonClick={handleFilterButtonClick}
                  onApplyFilter={handleApplyFilter}
                  onSortChange={handleSortChange}
                  onCloseFilterForm={handleCloseFilterForm}
                  onStatisticsClick={canViewDashboards ? handleOpenStatisticsModal : undefined}
                />
              } 
            />
            <Route 
              path="/dashboard/resolved"
              element={<ResolvedDashboardPage incidencias={incidencias} />}
            />
            <Route 
              path="/dashboard/general"
              element={<GeneralDashboardPage 
                incidencias={incidencias} 
                onStatisticsClick={canViewDashboards ? handleOpenStatisticsModal : undefined} 
              />}
            />
            <Route 
              path="/dashboard/:status"
              element={<StatusDashboardPage incidencias={incidencias} />}
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
                  assignees={assignees}
                  onPageChange={handlePageChange}
                />
              } 
            />
            <Route 
              path="/incidencias/:id" 
              element={<IncidenceDetailPage incidencias={incidencias} onUpdateStatus={handleUpdateStatus} />} 
            />
          </Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;
