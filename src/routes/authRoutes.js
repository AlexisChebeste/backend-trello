
const {Router}  = require('express');
const authController = require('../controllers/authController');
const User = require('../models/user.model');
const authMiddleware = require('../middleware/authMiddleware');

const router = Router();

router.post('/auth/signup', authController.signup);
router.post('/auth/login', authController.login);
router.post('/auth/logout', authController.logout);
router.get('/profile', authMiddleware, (req, res) => {
    const user = req.user;
    const userValido = {id: user.id, name: user.name, lastname: user.lastname, email: user.email, avatar: user.avatar, boards: user.boards, workspace: user.workspace}
    
    res.status(200).json(userValido);

});

router.get('/user/:id',
    authController.getUser
)

module.exports = router;