const express = require('express');
const router = express.Router();
const { getCategory, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const protect = require('../middlewares/authMiddleware');
const admin = require('../middlewares/roleMiddleware');

router.get('/get-category', protect, getCategory);
router.post('/create-category', protect, admin, createCategory);
router.put('/update-category/:id', protect, admin, updateCategory);
router.delete('/delete-category/:id', protect, admin, deleteCategory);

module.exports = router;