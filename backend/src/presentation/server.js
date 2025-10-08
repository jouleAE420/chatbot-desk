const express = require('express');
const cors = require('cors');
const { connectDB } = require('../infrastructure/data/db');
const app = express();
const PORT = 3000;

// Importar enrutadores
const incidenciasRoutes = require('./routes/incidencias.routes');
const authRoutes = require('./routes/auth.routes');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Usar las rutas
app.use('/api/incidencias', incidenciasRoutes);
app.use('/api/auth', authRoutes);

(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
      console.log('servidoractivo.');
    });
  } catch (error) {
    console.error('Fallo al iniciar el servidor', error);
    process.exit(1);
  }
})();

// Workaround para mantener el proceso activo en entornos específicos de Node.js/Windows
setInterval(() => {}, 1000 * 60 * 60);
