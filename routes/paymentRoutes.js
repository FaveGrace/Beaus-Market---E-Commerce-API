const express = require('express');
const router = express.Router();
const protect = require('../middlewares/authMiddleware');
const {createPayPalOrder} = require('../Utils/payment');

router.post('/paypal/create-order', protect, async (req, res, next) => {
    try{
        const {items} = req.body;
        const order = await createPayPalOrder(items);
        res.status(200).json({order});
    } catch (error) {
        next(error);
    }
});

module.exports = router;