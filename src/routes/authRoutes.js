
const {Router}  = require('express');
const authController = require('../controllers/authController');
const User = require('../models/user.model');
const authMiddleware = require('../middleware/authMiddleware');

const router = Router();

router.post('/auth/signup', authController.signup);
router.post('/auth/login', authController.login);
router.post('/auth/logout', authController.logout);
router.get('/me', authMiddleware, async (req, res) => {
    const user = await User.findById(req.userId);
    res.status(200).json(user);
});

module.exports = router;