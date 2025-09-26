require('dotenv').config();

const useMock = process.env.USE_MOCK_DB === 'true';

const userRepository = useMock
  ? require('./user.repository.mock')
  : require('./user.repository.mongo');

module.exports = userRepository;
