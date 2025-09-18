import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import type { TicketOptions } from '../domain/models/incidencia';
import { StatusType } from '../domain/models/incidencia';
import { getAllIncidencias, updateIncidenciaStatus } from '../application/services/incidencias.service';
import HomePage from './pages/HomePage';
import StatusPage from './pages/StatusPage';
import IncidenceDetailPage from './pages/IncidenceDetailPage';
import Header from './components/Header';
function App() {
  const [incidencias, setIncidencias] = useState<TicketOptions[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadIncidencias = async () => {
      try {
        console.log("Fetching incidencias..."); // Debuggin

        const data = await getAllIncidencias();
        console.log(data);
        
        // Ordenar incidencias por createdAt (más reciente primero para prioridad)
        const sortedData = data.sort((a, b) => b.createdAt - a.createdAt);
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
      <Header />
      {loading ? (
        <p>Cargando incidencias...</p>
      ) : (
        <main style={{ marginTop: '150px' }}>
          <Routes>
            <Route 
              path="/" 
              element={<HomePage incidencias={incidencias} onUpdateStatus={handleUpdateStatus} />} 
            />
            <Route 
              path="/:statusKey" 
              element={<StatusPage incidencias={incidencias} onUpdateStatus={handleUpdateStatus} />} 
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