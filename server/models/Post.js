const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        enum: ['electronics', 'fashion', 'home', 'vehicles', 'property', 'services', 'others'],
        required: true
    },
    images: [{
        type: String,
        required: true
    }],
    logo: {
        type: String
    },
    contactNumber: {
        type: String
    },
    location: {
        state: String,
        city: String,
        pincode: String,
        village: String
    },
    status: {
        type: String,
        enum: ['active', 'sold', 'expired'],
        default: 'active'
    },
    views: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Post', postSchema);