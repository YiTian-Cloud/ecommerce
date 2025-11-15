// server.js - ecart-backend

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// --- Config ---------------------------------------------------
const PORT = process.env.PORT || 3000;
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecart';

const app = express();

app.use(cors());
app.use(express.json());

// --- Mongoose models -----------------------------------------
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  imageUrl: String,
});

const orderItemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  quantity: Number,
});

const orderSchema = new mongoose.Schema(
  {
    name: String,        // buyer name
    email: String,       // buyer email (used for filtering)
    total: Number,
    items: [orderItemSchema],
  },
  { timestamps: true }   // adds createdAt, updatedAt
);

const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);

// --- Routes ---------------------------------------------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().lean();
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Create order (checkout)
app.post('/api/checkout', async (req, res) => {
  try {
    const { name, email, items, total } = req.body;

    if (!name || !email || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Invalid order payload' });
    }

    const order = new Order({
      name,
      email,
      items,
      total,
    });

    await order.save();

    res.json({
      success: true,
      orderId: order._id,
    });
  } catch (err) {
    console.error('Error during checkout:', err);
    res.status(500).json({ error: 'Checkout failed' });
  }
});

// Get orders for a given user by email
app.get('/api/orders', async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: 'email query param is required' });
    }

    const orders = await Order.find({ email })
      .sort({ createdAt: -1 })
      .lean();

    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// --- Seed sample products (optional) --------------------------
async function seedProductsIfEmpty() {
  const count = await Product.countDocuments();
  if (count > 0) {
    console.log(`Products already exist (${count}), skipping seed.`);
    return;
  }

  console.log('Seeding sample products…');

  const products = [
    {
      name: 'T-Shirt',
      price: 19.99,
      description: 'Soft cotton tee, perfect for casual wear.',
      imageUrl: 'tshirt.jpg', // or /tshirt.jpg if served by frontend
    },
    {
      name: 'Coffee Mug',
      price: 9.99,
      description: 'Ceramic mug for your favorite drinks.',
      imageUrl: 'mug.jpg',
    },
    {
      name: 'Sticker Pack',
      price: 4.99,
      description: 'Set of vinyl stickers.',
      imageUrl: 'stickerpack.jpg',
    },
  ];

  await Product.insertMany(products);
  console.log('Sample products seeded.');
}

// --- Start ----------------------------------------------------
async function start() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected:', MONGODB_URI);

    await seedProductsIfEmpty();

    app.listen(PORT, () => {
      console.log(`Backend running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
