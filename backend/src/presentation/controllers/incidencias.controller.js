const service = require('../../application/incidencias.service');

const getIncidencias = (req, res) => {
  try {
    const todasLasIncidencias = service.getIncidencias();
    res.status(200).json(todasLasIncidencias);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateIncidenciaStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status, assignedTo } = req.body;

    const updatedIncidencia = service.updateIncidenciaStatus(id, status, assignedTo);

    if (!updatedIncidencia) {
      return res.status(404).json({ message: 'Incidencia no encontrada' });
    }

    res.status(200).json(updatedIncidencia);
  } catch (error) {
    if (error.message.includes('requerido')) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getIncidencias,
  updateIncidenciaStatus,
};