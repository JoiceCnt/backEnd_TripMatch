const jwt = require('jsonwebtoken');
const User = require('../models/User.model.js');

const isAuth = async (req, res, next) => {
  const header = req.headers.authorization;

  // Validar que el header exista y tenga formato Bearer
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Invalid authorization header' });
  }

  const token = header.split(' ')[1];

  try {
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar usuario en DB
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found or invalid token' });
    }

    // Guardar usuario en request para usar en controladores
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = isAuth;
