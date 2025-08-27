const express = require('express');
const router = express.Router();
const {getDashboardData, createAdmin, makeAdmin} = require('../controllers/adminController');
const protect = require('../middlewares/authMiddleware');
const admin = require('../middlewares/roleMiddleware');

router.get('/dashboard', protect, admin, getDashboardData);
router.post('/create-admin', protect, admin, createAdmin);
router.put('/make-admin/:userId', protect, admin, makeAdmin);

module.exports = router;