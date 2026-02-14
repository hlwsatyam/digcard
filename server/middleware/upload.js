const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create upload directories
const dirs = [
  './uploads/stores/logos',
  './uploads/stores/banners',
  './uploads/stores/products',
  './uploads/stores/gallery'
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    if (req.baseUrl.includes('logo')) cb(null, './uploads/stores/logos');
    else if (req.baseUrl.includes('banner')) cb(null, './uploads/stores/banners');
    else if (req.baseUrl.includes('products')) cb(null, './uploads/stores/products');
    else if (req.baseUrl.includes('gallery')) cb(null, './uploads/stores/gallery');
    else cb(null, './uploads/stores/temp');
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${unique}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  const images = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const videos = ['video/mp4', 'video/quicktime'];
  
  if (images.includes(file.mimetype) || videos.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only images and videos are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }
});

module.exports = {
  uploadSingle: upload.single('file'),
  uploadMultiple: upload.array('files', 10)
};