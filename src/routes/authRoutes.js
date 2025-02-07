
const {Router}  = require('express');
const authController = require('../controllers/authController');
const User = require('../models/user.model');
const authMiddleware = require('../middleware/authMiddleware');

const router = Router();

router.post('/auth/signup', authController.signup);
router.post('/auth/login', authController.login);
router.post('/auth/logout', authController.logout);
router.get('/profile', authMiddleware, (req, res) => {
    res.status(200).json({user: req.user});
});

router.get('/user/:id',
    authController.getUser
)

module.exports = router;