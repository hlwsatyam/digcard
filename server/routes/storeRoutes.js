const express = require('express');
const router = express.Router();
const Store = require('../models/Store');
const { uploadSingle, uploadMultiple } = require('../middleware/upload');
const fs = require('fs');
const path = require('path');

// ============ GET STORE ============
// Get store by owner (for member dashboard)
router.get('/owner/:ownerId', async (req, res) => {
  try {
    const store = await Store.findOne({ owner: req.params.ownerId });
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    res.json(store);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get store by slug (for customer view)
router.get('/:slug', async (req, res) => {
  try {
    const store = await Store.findOne({ slug: req.params.slug }).populate('owner', 'name');
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    res.json(store);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============ CREATE STORE ============
router.post('/', async (req, res) => {
  try {
    const { owner, name, description, category } = req.body;
    
    const existingStore = await Store.findOne({ owner });
    if (existingStore) {
      return res.status(400).json({ message: 'You already have a store' });
    }

    // Set default business hours
    const businessHours = {
      monday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
      tuesday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
      wednesday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
      thursday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
      friday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
      saturday: { isOpen: false, openTime: '10:00', closeTime: '16:00' },
      sunday: { isOpen: false, openTime: '10:00', closeTime: '16:00' }
    };

    const store = new Store({
      owner,
      name,
      description,
      category,
      businessHours
    });

    await store.save();
    res.status(201).json({ success: true, store });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============ UPDATE BASIC INFO ============
 // ============ UPDATE BASIC INFO ============
router.put('/:storeId/basic', async (req, res) => {
  try {
    const store = await Store.findById(req.params.storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    const { name, description, category, contact } = req.body;
    
    if (name) store.name = name;
    if (description) store.description = description;
    if (category) store.category = category;
    
    // FIXED: Properly update contact object
    if (contact) {
      store.contact = {
        email: contact.email || store.contact?.email,
        phone: contact.phone || store.contact?.phone,
        website: contact.website || store.contact?.website,
        address: {
          street: contact.address?.street || store.contact?.address?.street,
          city: contact.address?.city || store.contact?.address?.city,
          state: contact.address?.state || store.contact?.address?.state,
          country: contact.address?.country || store.contact?.address?.country,
          zipCode: contact.address?.zipCode || store.contact?.address?.zipCode
        }
      };
    }

    await store.save();
    res.json({ success: true, store });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============ UPLOAD LOGO ============
router.post('/:storeId/logo', uploadSingle, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const store = await Store.findById(req.params.storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    // Delete old logo
    if (store.logo?.url) {
      const oldPath = path.join(__dirname, '..', store.logo.url);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    store.logo = {
      url: req.file.path,
      alt: store.name
    };

    await store.save();
    res.json({ success: true, logo: store.logo });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============ UPDATE BANNER ============
router.put('/:storeId/banner', uploadMultiple, async (req, res) => {
  try {
    const store = await Store.findById(req.params.storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    const { settings } = req.body;
    const files = req.files;

    // Add new banner images
    if (files && files.length > 0) {
      const newMedia = files.map((file, index) => ({
        url: file.path,
        type: file.mimetype.startsWith('video/') ? 'video' : 'image',
        alt: `${store.name} banner ${index + 1}`,
        order: (store.banner?.media?.length || 0) + index
      }));

      store.banner = {
        media: [...(store.banner?.media || []), ...newMedia],
        settings: settings ? JSON.parse(settings) : store.banner?.settings || {
          autoplay: true,
          autoplaySpeed: 3000,
          effect: 'slide'
        }
      };
    }

    await store.save();
    res.json({ success: true, banner: store.banner });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete banner image
router.delete('/:storeId/banner/:mediaIndex', async (req, res) => {
  try {
    const store = await Store.findById(req.params.storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    const index = parseInt(req.params.mediaIndex);
    if (store.banner?.media && store.banner.media[index]) {
      // Delete file
      const filePath = path.join(__dirname, '..', store.banner.media[index].url);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      
      store.banner.media.splice(index, 1);
      await store.save();
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============ UPDATE THEME ============
router.put('/:storeId/theme', async (req, res) => {
  try {
    const store = await Store.findById(req.params.storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    store.theme = { ...store.theme, ...req.body };
    await store.save();
    res.json({ success: true, theme: store.theme });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============ PRODUCTS ============
 

// Create product - FIXED for images
router.post('/:storeId/products', uploadMultiple, async (req, res) => {
  try {
    const store = await Store.findById(req.params.storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
console.log(req.file)
console.log(req.body)
console.log(req.files)
 
    const { name, description, price, category } = req.body;
    const files = req.files;

    // Validate required fields
    if (!name || !price) {
      return res.status(400).json({ message: 'Name and price are required' });
    }

    // Process images
    const images = files?.map((file, index) => ({
      url: file.path.replace(/\\/g, '/'), // Fix Windows paths
      isPrimary: index === 0
    })) || [];

    const product = {
      name,
      description: description || '',
      price: parseFloat(price),
      category: category || 'uncategorized',
      images,
      isActive: true,
      createdAt: new Date()
    };

    store.products.push(product);
    await store.save();

    res.json({ 
      success: true, 
      product: store.products[store.products.length - 1] 
    });
  } catch (error) {
    console.error('Product creation error:', error);
    res.status(500).json({ message: error.message });
  }
});





router.delete('/:storeId/products/:productIndex', async (req, res) => {
  try {
    const store = await Store.findById(req.params.storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    const index = parseInt(req.params.productIndex);
    if (store.products[index]) {
      // Delete product images
      store.products[index].images?.forEach(image => {
        const filePath = path.join(__dirname, '..', image.url);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });
      
      store.products.splice(index, 1);
      await store.save();
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============ SERVICES ============
router.post('/:storeId/services', async (req, res) => {
  try {
    const store = await Store.findById(req.params.storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    store.services.push(req.body);
    await store.save();

    res.json({ 
      success: true, 
      service: store.services[store.services.length - 1] 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:storeId/services/:serviceIndex', async (req, res) => {
  try {
    const store = await Store.findById(req.params.storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    store.services.splice(parseInt(req.params.serviceIndex), 1);
    await store.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============ BUSINESS HOURS ============
router.put('/:storeId/hours', async (req, res) => {
  try {
    const store = await Store.findById(req.params.storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    store.businessHours = { ...store.businessHours, ...req.body };
    await store.save();
    res.json({ success: true, businessHours: store.businessHours });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============ SOCIAL MEDIA ============
router.put('/:storeId/social', async (req, res) => {
  try {
    const store = await Store.findById(req.params.storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    store.socialMedia = req.body;
    await store.save();
    res.json({ success: true, socialMedia: store.socialMedia });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============ GALLERY ============
router.post('/:storeId/gallery', uploadMultiple, async (req, res) => {
  try {
    const store = await Store.findById(req.params.storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    const files = req.files;
    const newGalleryItems = files.map((file, index) => ({
      url: file.path,
      type: file.mimetype.startsWith('video/') ? 'video' : 'image',
      title: req.body.title || `Gallery ${store.gallery.length + index + 1}`,
      order: store.gallery.length + index
    }));

    store.gallery.push(...newGalleryItems);
    await store.save();

    res.json({ success: true, gallery: store.gallery });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============ SEO ============
router.put('/:storeId/seo', async (req, res) => {
  try {
    const store = await Store.findById(req.params.storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    store.seo = { ...store.seo, ...req.body };
    await store.save();
    res.json({ success: true, seo: store.seo });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;