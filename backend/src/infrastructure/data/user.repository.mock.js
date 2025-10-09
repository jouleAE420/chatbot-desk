
class UserRepositoryMock {
  constructor() {
    this.users = [
      {
        id: 1,
        name: "Admin User",
        // Asegúrate de que tus usuarios de prueba tengan un email
        email: "admin@example.com", 
        username: "admin",
        password: "password123", // En un proyecto real, la contraseña estaría encriptada
        role: "admin",
      },
      {
        id: 2,
        name: "Supervisor User",
        email: "supervisor@example.com",
        username: "supervisor",
        password: "password123",
        role: "supervisor",
      },
      {
        id: 3,
        name: "Normal User",
        email: "user@example.com",
        username: "user",
        password: "password123",
        role: "user",
      },
    ];
  }

  async getAll() {
    return this.users;
  }

  async findByEmail(email) {
    const user = this.users.find((user) => user.email === email);
    return user;
  }

  async findById(id) {
    const user = this.users.find((user) => user.id === id);
    return user;
  }
}

export default new UserRepositoryMock();