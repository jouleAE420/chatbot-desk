const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Importar el enrutador de incidencias de la nueva ubicación
const incidenciasRoutes = require('./routes/incidencias.routes');

// Middleware
app.use(cors());
app.use(express.json());

// Usar las rutas
// Todas las rutas definidas en incidencias.routes.js ahora estarán bajo /api/incidencias
app.use('/api/incidencias', incidenciasRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
  console.log('servidoractivo.');
});

// Workaround para mantener el proceso activo en entornos específicos de Node.js/Windows
setInterval(() => {}, 1000 * 60 * 60);
