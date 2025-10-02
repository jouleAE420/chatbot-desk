const bcrypt = require('bcryptjs');

const seedDatabase = async (db) => {
  const usersCollection = db.collection('users');

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
    const userExists = await usersCollection.findOne({ username: user.username });
    if (!userExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);

      await usersCollection.insertOne({
        username: user.username,
        password: hashedPassword,
        role: user.role,
        createdAt: new Date(),
      });
      console.log(`Usuario de prueba '${user.username}' creado.`);
    }
  }
};

module.exports = {
  seedDatabase,
};