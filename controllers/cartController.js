const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({user: req.user._id}).populate('items.product');
        if(!cart) cart = {items: []};
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({message: 'Internal server error', error: error.message});
    }
};

exports.addToCart = async (req, res) => {
    try{
        const {productId, quantity = 1} = req.body;

        let product = await Product.findById(productId);
        if(!product) return res.status(404).json({message: "Product not found"});

        let cart = await Cart.findOne({user: req.user._id});
        if(!cart) {
            cart = await Cart.create({user: req.user._id,
                items: [{product: productId, quantity}]
            });
            return res.status(201).json(cart);
        }

        const itemIndex = cart.items.find(item => item.product && item.product.toString() === productId);
        if(itemIndex > -1){
            cart.items[itemIndex].quantity += quantity;
        }else{
            cart.items.push({products: productId, quantity});
        }

        await cart.save();
        res.status(200).json({message: 'Item added to cart successfully', cart});
    }catch(error){
        res.status(500).json({message: 'Internal server error', error: error.message});
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const {productId} = req.body;

        let cart = await Cart.findOne({user: req.user._id});
        if(!cart) return res.status(404).json({message: "Cart not found"});

        cart.items = cart.items.filter(item => {
            if(!item.product) return false;
            return !item.product.equals(productId);
        });
        await cart.save();
        res.status(200).json({message: 'Item removed from cart successfully', cart});
    } catch (error) {
        res.status(500).json({message: 'Internal server error', error: error.message});
    }
}

exports.clearCart = async (req, res) => {
    try {
        await Cart.findOneAndDelete({user: req.user._id});
        res.status(200).json({message: 'Cart cleared successfully'});
    } catch (error) {
        res.status(500).json({message: 'Internal server error', error: error.message});
    }
};