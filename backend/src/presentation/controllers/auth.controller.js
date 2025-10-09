//esta const sirve para manejar las rutas de autenticacion
const authService = require('../../application/auth.service');
//la funcion register sirve para registrar un usuario
const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: 'Username, email, password, and role are required' });
    }
    const newUser = await authService.registerUser({ username, email, password, role });
    res.status(201).json({ message: 'User created successfully', userId: newUser.insertedId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const { token, user } = await authService.loginUser({ email, password });
    res.status(200).json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role } });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
};
