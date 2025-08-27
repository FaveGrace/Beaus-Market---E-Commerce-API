const express = require('express');
const router = express.Router();
const { register, login, getLoggedUser, getAllUsers, updateProfile } = require('../controllers/authController');
const protect = require('../middlewares/authMiddleware');
const admin = require('../middlewares/roleMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/get-profile', protect, getLoggedUser);
router.get('/get-all-users', protect, admin, getAllUsers);

module.exports = router;