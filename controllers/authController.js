const User = require('../models/User');
const jwt = require('jsonwebtoken');

const createToken = (user) => {
    return jwt.sign({ id: user._id, isAdmin: user.isAdmin }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1d' });
};

exports.register = async (req, res) => {
    const {name, email, password} = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = await User.create({ name, email, password, isAdmin: 'user'});

        const token = createToken(newUser);
        return res.status(201).json({ message: 'User registered', user: {id: newUser._id, name: newUser.name, email: newUser.email, isAdmin: newUser.isAdmin}, token });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.login = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email});
        if (!user || !(await user.matchPassword(password)))
            return res.status(401).json({ message: 'Invalid credentials' });

        const token = createToken(user);
        res.json({
            message: 'Login successful', 
            user: {id: user._id, email: user.email, name: user.name, isAdmin: user.isAdmin}, 
            token
        });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message});
    }
};

exports.getLoggedUser = async (req, res) => {
    try{
        const user = await User.findById(req.user.id).select('-password');
        if(!user) return res.status(404).json({messge: 'User not found'});

        res.json({user});
    }catch(error){
        res.status(500).json({message: 'Server error', error: error.message});
    }
};

exports.getAllUsers = async (req, res) => {
    try{
        const users = await User.find().select('-password');
        res.status(200).json(users);
    }catch(error){
        res.status(500).json({message: 'Server error', error: error.message});
    }
};