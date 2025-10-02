require('dotenv').config();

const useMock = process.env.USE_MOCK_DB === 'true';
let repository;

if (useMock) {
  repository = require('./incidencias.repository.mock');
} else {
  repository = require('./incidencias.repository.mongo');
}

module.exports = repository;