const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const router = require('./routes/index');

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(cors());

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URL)
.then(() => {
    console.log('MongoDB connected');

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    })
});

app.use('/api', router);

app.get('/', (req, res) => {
    res.status(200).json({message: 'Welcome to Beaus Market.'});
});


// E-commerce Platform (handles the backend flow for Ecommerce application)
// Description: Build an e-commerce platform where users can browse
// products, add them to a cart, and make purchases. Admin users can
// manage product listings, view orders, and update order statuses.
// Features:
//  User registration and login
//  Product catalogue with categories
//  Shopping cart
//  Admin specific actions