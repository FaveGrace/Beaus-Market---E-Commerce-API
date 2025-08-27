const Product = require('../models/Product');
const Category = require('../models/Category');

exports.getProducts = async (req, res) => {
    try {
        const {page = 1, limit = 10, keyword = '', category } = req.query;

        const query = {
            name: { $regex: keyword, $options: 'i' },
            ...(category ? { category } : {})
        };

        const total = await Product.countDocuments(query);
        const products = await Product.find(query)
            .populate('category', 'name')
            .skip((page - 1) * limit)
            .limit(parseInt(limit));
        
        res.status(200).json({
            products,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalItems: total
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category', 'name');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product', error: error.message});
    }
};

exports.createProduct = async (req, res) => {
    try {
        const {name, price, description, category: categoryId, stock} = req.body;
        if(categoryId) {
            const type = await Category.findById(categoryId);
            if(!type) return res.status(400).json({message: "Category not found"});
        }
        const product = await Product.create({name, price, description, category: categoryId, stock});
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error creating product', error });
    }
}

exports.updateProduct = async (req, res) => {
    try{
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if(!product)
            return res.status(404).json({message: "Product not found"});
        res.json(product);
        }catch (error) {
            res.status(500).json({message: 'Error updating product', error: error.message})
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({message: "Product deleted successfully"});
    } catch (error) {
        res.status(500).json({message: 'Error deleting product', error: error.message});
    }
};

exports.addReview = async (req, res) => {
    try{
        const { rating, comment } = req.body;
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        const alreadyReviewed = product.reviews.find(review => review.user.toString() === req.user._id);
        if (alreadyReviewed) {
            return res.status(400).json({ message: 'Product already reviewed' });
        }

        const review = {
            user: req.user._id,
            name: req.body.name || 'Anonymous',
            rating: Number(rating),
            comment
        };
        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.averageRating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error adding review', error: error.message });
    }
};