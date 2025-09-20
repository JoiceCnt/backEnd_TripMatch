// controllers/userController.js

// Ejemplo: obtener todos los usuarios
const getUsers = (req, res) => {
  res.json({ message: 'Aquí irán los usuarios' });
};

// Ejemplo: crear un usuario
const createUser = (req, res) => {
  res.json({ message: 'Usuario creado' });
};

module.exports = { getUsers, createUser };
