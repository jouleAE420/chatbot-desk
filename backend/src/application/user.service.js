const userRepository = require('../infrastructure/data/user.repository');

const getAllUsers = async () => {
  const users = await userRepository.findAllUsers();
  return users;
};

module.exports = {
  getAllUsers,
};