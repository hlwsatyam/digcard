const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const storeRoutes = require('./routes/storeRoutes');
const User = require('./models/User');
require('dotenv').config();
const morgan = require('morgan');
const app = express();
 
// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));   // logging middleware
app.use('/uploads', express.static('uploads'));



// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stores', storeRoutes);
 



mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/user-management')
.then(async () => {
  console.log('MongoDB connected');

  const existingAdmin = await User.findOne({ email: "admin@example.com" });

  if (!existingAdmin) {
    const admin = await User.create({
      name: "Admin User", 
      email: "admin@example.com",
      password: "$2a$10$6KqV9HX9bY9X9bY9X9bY9uX9bY9X9bY9X9bY9X9bY9X9bY9X9bY9u",
      role: "admin",
      phone: "+1234567890",
      address: "Admin Office, Main Street"
    });

    await User.create({
      name: "John Doe",
      email: "member@example.com",
      password: "$2a$10$6KqV9HX9bY9X9bY9X9bY9uX9bY9X9bY9X9bY9X9bY9X9bY9X9bY9u",
      role: "member",
      phone: "+9876543210",
      address: "123 Member Street",
      createdBy: admin._id
    });

    console.log("Default users created");
  }
})
.catch(err => console.log(err));








const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {


  console.log(`Server running on port ${PORT}`);
});