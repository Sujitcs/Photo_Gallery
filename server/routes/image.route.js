const imagemodel = require('../models/Image.model');
const multer = require('multer');
const express = require('express');
const imagerouter = express.Router();
const auth = require('../middlewares/authMiddleware');
require('dotenv').config();
const fs = require('fs');
const path = require('path');


// Multer setup for image upload
const uploadStorage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
  destination: './public/assets'
});

// File filter to only accept JPEG and PNG
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png','image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept file
  } else {
    cb(new Error('Only JPEG and PNG files are allowed!'), false);
  }
};

const uploadObject = multer({
  storage: uploadStorage,
  fileFilter: fileFilter 
});

// Add Image
imagerouter.post('/addimage', auth, uploadObject.single('image'), async (req, res) => {
  const { name, category } = req.body;
  const image = req.file.filename;

  try {
    const newImage = await imagemodel.create({ name, category, image });

    res.status(201).json(newImage);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get all images
imagerouter.get('/getimage', async (req, res) => {
  try {
    const images = await imagemodel.find({});
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get images by category
imagerouter.get('/getimage/:category', async (req, res) => {
  const category = req.params.category;

  try {
    const images = await imagemodel.find({ category });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Edit Image
imagerouter.put('/editimage/:id', auth, uploadObject.single('image'), async (req, res) => {
  const { id } = req.params;
  const { name, category } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    const updatedImageData = { name, category };
    if (image) {
      updatedImageData.image = image;
    }

    const updatedImage = await imagemodel.findByIdAndUpdate(id, updatedImageData, { new: true });

    if (updatedImage) {
      res.status(200).json({ message: 'Image updated successfully', image: updatedImage });
    } else {
      res.status(404).json({ message: 'Image not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update image', error: error.message });
  }
});

// Delete Image
// imagerouter.delete('/deleteimage/:id', auth, async (req, res) => {
//   const { id } = req.params;

//   try {
//     const image = await imagemodel.findByIdAndDelete(id);

//     if (image) {
//       res.json({ message: 'Image removed' });
//     } else {
//       res.status(404).json({ message: 'Image not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'Server Error' });
//   }
// });
// Delete Image from file
imagerouter.delete('/deleteimage/:id', auth, async (req, res) => {
  const { id } = req.params;

  try {
    // Find the image document first
    const image = await imagemodel.findByIdAndDelete(id);

    if (image) {
      // Construct the file path
      const imagePath = path.join(__dirname, '..', 'public', 'assets', image.image);

      // Remove the file from the filesystem
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error('Error deleting image file:', err);
          return res.status(500).json({ message: 'Image removed from database but failed to delete file' });
        }
        console.log('Image file deleted:', imagePath);
      });

      res.json({ message: 'Image removed' });
    } else {
      res.status(404).json({ message: 'Image not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});


module.exports = imagerouter;
console.log('Image router is ready');
