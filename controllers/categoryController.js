const Category = require('../models/Category');

exports.getCategory = async (req, res) => {
    try{
        const category = await Category.find().sort('name');
    res.json(category)
    }catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.createCategory = async (req, res) => {
    try{
        const {name} = req.body;
        const existingCategory = await Category.findOne({name});
        if(existingCategory) return res.status(400).json({message: 'Category already exists'});

        const category = await Category.create({name});
        res.status(201).json(category);
    }catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.updateCategory = async (req, res) => {
    try{
        const category = await Category.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json(category);
    }catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try{
        await Category.findByIdAndDelete(req.params.id);
        res.status(204).json({ message: 'Category deleted' });
    }catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};