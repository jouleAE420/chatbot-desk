require('dotenv').config();

const useMock = process.env.USE_MOCK_DB === 'true';
let userRepository;

if (useMock) {
  userRepository = require('./user.repository.mock');
} else {
  userRepository = require('./user.repository.mongo');
}

module.exports = userRepository;
