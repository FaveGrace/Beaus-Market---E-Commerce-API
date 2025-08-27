const Order = require('../models/Order');
const Cart = require('../models/Cart');
//const sendEmail = require('../Utils/email');

exports.placeOrder = async (req, res) => {
    try{
        const { shippingAddress, paymentMethod } = req.body;
        const cart = await Cart.findOne({ user: req.user._id}).populate('items.product');
        if(!cart)
            return res.status(404).json({ message: 'Cart not found' });

        let totalAmount = 0;
        cart.items.forEach(item => {
            if(item.product){
                totalAmount += item.product.price * item.quantity;
            }
        });    

        const validItems = cart.items.filter(item => item.product);

        const order = await Order.create({
            user: req.user._id,
            items: validItems.map(item => ({
                product: item.product._id,
                quantity: item.quantity
            })),
            shippingAddress,
            totalAmount: totalAmount,
            paymentMethod: paymentMethod,
            status: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Pending'
        });

        await cart.deleteOne();

        // await sendEmail(
        //     req.user.email || 'faychi19@gmail.com',
        //     'Order Confirmation',
        //     `<h1>Order Received</h1>
        //     <p>Total: #${totalAmount.toFixed(2)}</p>
        //     <p>Order ID: ${order._id}</p>`
        // );
        res.status(201).json({ message: 'Order placed successfully', order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.getAllOrders = async (req, res) => {
    try{
        const orders = await Order.find().populate('user', 'name email').populate('items.product');
        res.status(200).json(orders);
    } catch (error){
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.getUserOrders = async (req, res) => {
    try{
        const orders = await Order.find({user: req.user.id}).populate('items.product');
        res.status(200).json(orders);
    }catch (error){
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try{
        const {status} = req.body;
        const order = await Order.findByIdAndUpdate(req.params.id, 
            { status }, { new: true });
        res.status(200).json({message: 'Your order has been updated', order});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};