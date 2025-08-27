const express = require('express');
const router = express.Router();
const {getCart, addToCart, removeFromCart, clearCart} = require('../controllers/cartController');
const protect = require('../middlewares/authMiddleware');

router.get('/get-cart', protect, getCart);
router.post('/add-to-cart', protect, addToCart);
router.delete('/remove-from-cart', protect, removeFromCart);
router.delete('/clear-cart', protect, clearCart);

module.exports = router;