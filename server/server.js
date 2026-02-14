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
 const webpush = require("web-push");
const PushSubscription = require('./models/PushSubscription');
// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));   // logging middleware
app.set("trust proxy", true);

app.use('/uploads', express.static('uploads'));
app.use('/file', express.static('file'));
const vapidKeys = {
  publicKey: "BCaktoh-AkWnW9QHYTWojeUd9XAsMgWjCji2DgVOYDTl1nyXFDVS98agktx7def2E1-1Don3A6uLLJ9gpS-bSik",
  privateKey: "35HRQGLmzrszdpJMzPqJSO1NkZEAl4g37IBJGTrOrpQ",
};

webpush.setVapidDetails(
  "mailto:test@test.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stores', storeRoutes);
 
 
 
app.post("/subscribe", async (req, res) => {
  try {
    const { subscription, ownerId,currentUrl, pathname } = req.body;
 
    if (!subscription?.endpoint) {
      return res.status(400).json({ error: "Invalid subscription" });
    }

    if (ownerId &&ownerId?._id && pathname==='/member/dashboard' && subscription?.endpoint ){
await User.findByIdAndUpdate(
      ownerId?._id , // 👈 match by endpoint
      {
        endpoint: subscription.endpoint,
        expirationTime: subscription.expirationTime,
        keys: subscription.keys,
      
      }
       
    )


    }


    const updated = await PushSubscription.findOneAndUpdate(
      { endpoint: subscription.endpoint }, // 👈 match by endpoint
      {
        endpoint: subscription.endpoint,
        expirationTime: subscription.expirationTime,
        keys: subscription.keys,
        currentUrl,
        pathname,
      },
      { upsert: true, new: true } // 👈 create if not exists
    );

    res.status(201).json({
      message: "Subscription saved/updated successfully",
      data: updated,
    });

  } catch (error) {
    console.error("Subscribe error:", error);
    res.status(500).json({ error: "Failed to save subscription" });
  }
});


 



// In your server.js or routes
app.get("/send", async (req, res) => {
  if (!subscription) return res.status(400).send("No subscriber");

  // You can get these from database based on user/store
  const payload = JSON.stringify({
    title: "🔥 New Offer!",
    body: "Check out our latest deals",
    icon: `https://png.pngtree.com/recommend-works/png-clipart/20250321/ourmid/pngtree-green-check-mark-icon-png-image_15808519.png`, // Small icon
    image: `https://static.vecteezy.com/system/resources/thumbnails/057/068/323/small/single-fresh-red-strawberry-on-table-green-background-food-fruit-sweet-macro-juicy-plant-image-photo.jpg`, // Large image
    badge: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpNcBzxezXVwrf-AfAl2xP4l3IihyDHuJGgw&s`, // Badge icon
    url: "/member/store", // URL to open on click
    
  });

  try {
    await webpush.sendNotification(subscription, payload);
    res.json({ 
      success: true, 
      message: "Notification sent with icons" 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
});






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