const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');

exports.getDashboardData = async (req, res) => {
    try{
        const totalUsers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();
        const orders = await Order.find();
        const totalOrders = orders.length;
        const revenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        res.status(200).json({
            totalUsers,
            totalProducts,
            totalOrders,
            revenue
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.createAdmin = async (req, res) => {
    try{
        const {name, email, password} = req.body;

        const existing = await User.findOne({email});
        if(existing) return res.status(400).json({message: 'Email already exists'});

        const admin = await User.create({
            name,
            email,
            password,
            isAdmin: 'admin'
        });

        res.status(201).json({
            message: 'New admin created successfully',
            admin: {id: admin._id, name: admin.name, email: admin.email, isAdmin: admin.isAdmin}
        });
    }catch(error){
        res.status(500).json({message: 'Server error', error: error.message});
    }
};

exports.makeAdmin = async (req, res) => {
    try{
        const {userId} = req.params; //Id of the user to be made an admin

        const user = await User.findById(userId);
        if(!user) return res.status(404).json({message: 'User not found.'});

        user.isAdmin = 'admin';
        await user.save();

        res.status(200).json({message: `${user.name} is now an admin`, user: {id: user._id, email: user.email, isAdmin: user.isAdmin}});
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};