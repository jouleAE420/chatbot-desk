const bcrypt = require('bcryptjs');

// In-memory user store
let users = [];
let nextUserId = 1;

const seedUsers = async () => {
    if (users.length > 0) return;

    const usersToSeed = [
        {
            username: 'admin',
            password: 'admin',
            role: 'admin',
        },
        {
            username: 'tech',
            password: 'tech',
            role: 'technician',
        },
        {
            username: 'supervisor',
            password: 'supervisor',
            role: 'supervisor',
        }
    ];

    for (const user of usersToSeed) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);

        users.push({
            _id: nextUserId++,
            username: user.username,
            password: hashedPassword,
            role: user.role,
        });
    }
};

// Seed the users when the module is loaded
seedUsers();

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

const findAllUsers = async () => {
  // Return all users without their passwords
  const usersWithoutPasswords = users.map(({ password, ...rest }) => rest);
  return Promise.resolve(usersWithoutPasswords);
};

module.exports = {
  findUserByUsername,
  createUser,
  findAllUsers,
};