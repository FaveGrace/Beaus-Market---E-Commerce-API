const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv =require('dotenv');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGODB_URL)
.then(async () => {
    console.log('MongoDB connected...');

    const adminExists = await User.findOne({email: 'admin@beausmarket.com'});
    if(adminExists){
        console.log('Admin already exists:', adminExists.email);
    }else{
        const admin = await User.create({
            name: 'Super Admin',
            email: 'admin@beausmarket.com',
            password: 'AdminPass123@',
            isAdmin: 'admin'
        });
        console.log('Admin created:', admin.email);
    }

    mongoose.disconnect();
})
.catch(error => {
    console.error('Error seeding admin:', error.message);
    mongoose.disconnect();
});