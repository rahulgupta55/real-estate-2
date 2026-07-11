// This script creates an admin user in the database
// Run with: node scripts/create-admin.js

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/myflat';

// Admin user details
const adminUser = {
  name: 'Admin User',
  email: 'admin@myflat.com',
  password: 'admin123', // Change this to a secure password
  role: 'admin',
  isSubscribed: true,
  subscriptionExpiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
};

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Define User schema
    const UserSchema = new mongoose.Schema(
      {
        name: String,
        email: String,
        password: String,
        role: String,
        isSubscribed: Boolean,
        subscriptionExpiryDate: Date,
      },
      { timestamps: true }
    );
    
    // Create User model
    const User = mongoose.models.User || mongoose.model('User', UserSchema);
    
    try {
      // Check if admin user already exists
      const existingAdmin = await User.findOne({ email: adminUser.email });
      
      if (existingAdmin) {
        console.log('Admin user already exists');
        process.exit(0);
      }
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminUser.password, salt);
      
      // Create admin user
      const newAdmin = await User.create({
        ...adminUser,
        password: hashedPassword,
      });
      
      console.log('Admin user created successfully');
      console.log(`Email: ${adminUser.email}`);
      console.log(`Password: ${adminUser.password}`);
      
      process.exit(0);
    } catch (error) {
      console.error('Error creating admin user:', error);
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  });
