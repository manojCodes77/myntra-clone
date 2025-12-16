import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { getStoredItems, getItemById, storeItem, deleteItem, updateItem } from './controllers/items-controller.js';
import upload from './middleware/upload.js';
import { uploadToCloudinary, deleteFromCloudinary } from './utils/imageUpload.js';
import { getRedisClient } from './config/redis.js';

dotenv.config();

// Initialize Redis connection on startup
getRedisClient();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get("/", (req, res) => {
  res.json({
    message: "Jai Shree Ram bhai, server is running!",
    status: "healthy",
    database: "PostgreSQL with Prisma",
    storage: "Cloudinary"
  });
});

// Get all items
app.get('/items', async (req, res) => {
  try {
    const items = await getStoredItems();
    res.json({ items });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// Get single item by ID
app.get('/items/:id', async (req, res) => {
  try {
    const item = await getItemById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ item });
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

// Create new item with image upload
app.post('/items', upload.single('image'), async (req, res) => {
  try {
    let imageUrl = '';

    // If image file is uploaded, upload to Cloudinary
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer, req.file.originalname);
    } else if (req.body.image) {
      // If image URL is provided in body
      imageUrl = req.body.image;
    } else {
      return res.status(400).json({ error: 'Image is required' });
    }

    const itemData = {
      image: imageUrl,
      company: req.body.company,
      item_name: req.body.item_name,
      original_price: parseInt(req.body.original_price),
      current_price: parseInt(req.body.current_price),
      discount_percentage: parseInt(req.body.discount_percentage),
      return_period: parseInt(req.body.return_period) || 14,
      delivery_date: req.body.delivery_date,
      rating: {
        stars: parseFloat(req.body.rating_stars) || 0,
        count: parseInt(req.body.rating_count) || 0,
      },
    };

    const newItem = await storeItem(itemData);
    res.status(201).json({ message: 'Item created successfully', item: newItem });
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Failed to create item', details: error.message });
  }
});

// Update item
app.put('/items/:id', upload.single('image'), async (req, res) => {
  try {
    const itemData = { ...req.body };

    // If new image is uploaded, upload to Cloudinary and delete old one
    if (req.file) {
      const oldItem = await getItemById(req.params.id);
      if (oldItem && oldItem.image) {
        // Delete old image from Cloudinary if it's a Cloudinary URL
        if (oldItem.image.includes('cloudinary.com')) {
          await deleteFromCloudinary(oldItem.image);
        }
      }
      itemData.image = await uploadToCloudinary(req.file.buffer, req.file.originalname);
    }

    // Parse numeric fields
    if (itemData.original_price) itemData.original_price = parseInt(itemData.original_price);
    if (itemData.current_price) itemData.current_price = parseInt(itemData.current_price);
    if (itemData.discount_percentage) itemData.discount_percentage = parseInt(itemData.discount_percentage);
    if (itemData.return_period) itemData.return_period = parseInt(itemData.return_period);
    if (itemData.rating_stars || itemData.rating_count) {
      itemData.rating = {
        stars: parseFloat(itemData.rating_stars) || 0,
        count: parseInt(itemData.rating_count) || 0,
      };
    }

    const updatedItem = await updateItem(req.params.id, itemData);
    res.json({ message: 'Item updated successfully', item: updatedItem });
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Failed to update item', details: error.message });
  }
});

// Delete item
app.delete('/items/:id', async (req, res) => {
  try {
    const item = await getItemById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Delete image from Cloudinary if it's a Cloudinary URL
    if (item.image && item.image.includes('cloudinary.com')) {
      await deleteFromCloudinary(item.image);
    }

    await deleteItem(req.params.id);
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// Upload image only (utility endpoint)
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const imageUrl = await uploadToCloudinary(req.file.buffer, req.file.originalname);
    res.json({ message: 'Image uploaded successfully', url: imageUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image', details: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📦 Database: PostgreSQL with Prisma ORM`);
  console.log(`☁️  Storage: Cloudinary`);
});