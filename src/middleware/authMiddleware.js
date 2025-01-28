
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const verifyToken = async (req, res, next) => {
    const token = req.cookies.token;
    if(!token) return res.status(401).json({message: 'Acceso denegado. No hay token.'});

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'Token inválido o usuario no encontrado.' });
        }

        req.user = user; // Adjuntar usuario autenticado al objeto req
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Token inválido o expirado.' });
    }
    
    
}

module.exports = verifyToken;