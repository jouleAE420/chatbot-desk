const bcrypt = require('bcryptjs');

const seedDatabase = async (db) => {
  const usersCollection = db.collection('users');

  const usersToSeed = [
    {
      username: 'admin',
      email: 'admin@example.com',
      password: 'Admin1234',
      role: 'admin',
    },
    {
      username: 'operador',
      email: 'operador@example.com',
      password: 'Operador12345',
      role: 'operador',
    },
    {
      username: 'supervisor',
      email: 'supervisor@example.com',
      password: 'Super123',
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
        email: user.email,
        password: hashedPassword,
        role: user.role,
        createdAt: new Date(),
      });
      console.log(`Usuario de prueba '${user.username}' creado.`);
    }
  }

  const incidenciasCollection = db.collection('incidencias');
  const count = await incidenciasCollection.countDocuments();
  console.log(`Número de incidencias en la base de datos: ${count}`);


  if (count === 0) {
    console.log('No hay incidencias, creando datos de prueba...');
    const locations = ['zitacuaro', 'naucalpan',  'plaza bella', 'suburbia_mrl', 'dorada'];
    const ticketTypes = ['COMPLAINT', 'SUGGESTION', 'OTHER'];
    const statuses = ['CREATED', 'PENDING', 'IN_PROGRESS', 'RESOLVED'];
    const incidents = [];

    for (let i = 0; i < 100; i++) {
      const randomLocation = locations[Math.floor(Math.random() * locations.length)];
      const randomTicketType = ticketTypes[Math.floor(Math.random() * ticketTypes.length)];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

      incidents.push({
        id: i + 1,
        title: `Incidencia de prueba ${i + 1}`,
        description: `Descripción de la incidencia de prueba ${i + 1}`,
        location: randomLocation,
        type: randomTicketType,
        status: randomStatus,
        createdAt: new Date(),
      });
    }

    await incidenciasCollection.insertMany(incidents);
    console.log('100 incidencias de prueba creadas.');
  } else {
    console.log('La colección de incidencias no está vacía, no se crearán datos de prueba.');
  }
};

module.exports = {
  seedDatabase,
};
