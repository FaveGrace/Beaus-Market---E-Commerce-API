const express = require('express');
const router = express.Router();
const {getProducts, getProductById, createProduct, updateProduct, deleteProduct, addReview} = require('../controllers/productController');
const protect = require('../middlewares/authMiddleware');
const admin = require('../middlewares/roleMiddleware');

router.get('/get-products', getProducts);
router.get('/get-product/:id', getProductById);
router.post('/add-review/:id', protect, addReview);
router.post('/create-product', protect, admin, createProduct);
router.put('/update-product/:id', protect, admin, updateProduct);
router.delete('/delete-product/:id', protect, admin, deleteProduct);

module.exports = router;