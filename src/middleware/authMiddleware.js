
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if(!token) return res.status(401).json({message: 'Access denied'});

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err) return res.status(401).json({message: 'Invalid token'});
        req.userId = decoded.id;
        next();
    });
    
}

module.exports = verifyToken;