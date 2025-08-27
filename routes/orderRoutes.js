const express = require('express');
const router = express.Router();
const {placeOrder, getUserOrders, getAllOrders, updateOrderStatus} = require('../controllers/orderController');
const protect = require('../middlewares/authMiddleware');
const admin = require('../middlewares/roleMiddleware');

router.post('/place-order', protect, placeOrder);
router.get('/get-my-orders', protect, getUserOrders);
router.get('/get-all-orders', protect, admin, getAllOrders);
router.patch('/update-order/:orderId', protect, admin, updateOrderStatus);

module.exports = router;