const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@lifeline.com' });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const admin = new User({
      name: 'Administrator',
      email: 'admin@lifeline.com',
      mobile: '9999999999',
      password: 'admin123',
      role: 'admin',
      username:"1111",
      status: 'active',
      isVerified: true
    });

    await admin.save();
    
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@lifeline.com');
    console.log('🔑 Password: admin123');
    console.log('⚠️  Please change the password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();