const bcrypt = require('bcryptjs');

// In-memory user store
let users = [];
let nextUserId = 1;

const findUserByUsername = async (username) => {
  const user = users.find(u => u.username === username);
  return Promise.resolve(user); // Return a promise to mimic async DB call
};

const createUser = async (userData) => {
  const { username, password, role } = userData;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = {
    _id: nextUserId++,
    username,
    password: hashedPassword,
    role,
  };

  users.push(newUser);
  // To mimic insertOne result
  return Promise.resolve({ acknowledged: true, insertedId: newUser._id });
};

module.exports = {
  findUserByUsername,
  createUser,
};
