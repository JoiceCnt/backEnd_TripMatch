const jwt = require('jsonwebtoken');
const User = require('../models/User.model.js');

const isAuth = async (req, res, next) => {
  try {
   
    const header = req.headers.authorization;
    console.log("🔎 Header recibido en backend:", header);

    if (!header || !header.startsWith('Bearer ')) {
      console.log("❌ Authorization header inválido o ausente");
      return res.status(401).json({ message: 'Invalid authorization header' });
    }
    

    const token = header.split(" ")[1];
    console.log("🔑 Token extraído:", token);

    if (!token || token === "null" || token === "undefined") {
      console.log("❌ Token vacío o inválido (null/undefined)");
      return res.status(401).json({ message: "Invalid token" });
    }
    
    let decoded;
    // Verificar token
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      console.log("📨 Payload decodificado:", decoded);

    } catch (err) {
      console.log("❌ Error verificando token:", err.message);
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      }
      return res.status(401).json({ message: 'Invalid token' });
    }

    if (!decoded.id) {
      console.log("❌ Token válido pero sin campo id");
      return res.status(401).json({ message: "Invalid token payload" });
    }

    // Buscar usuario en DB
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      console.log("❌ Usuario no encontrado en DB");
      return res.status(401).json({ message: 'User not found or invalid token' });
    }

    // Guardar usuario en request para usar en controladores
    req.user = user;
    console.log("✅ Usuario autenticado:", user.name);

    next();
  } catch (err) {
    console.log("❌ Error inesperado en isAuth:", err);
    return res.status(401).json({ message: 'Authentication failed' });
  }
};

module.exports = isAuth;

