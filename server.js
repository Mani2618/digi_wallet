// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  balance: { type: Number, default: 1000 },
  upiId: { type: String, unique: true },
});

// Password Hashing before saving user
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model('User', userSchema);

// Transaction Schema
const transactionSchema = new mongoose.Schema({
  sender_upi_id: { type: String, required: true },
  receiver_upi_id: { type: String, required: true },
  amount: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// Routes

// Generate unique UPI ID
const generateUPIId = () => `${crypto.randomBytes(4).toString('hex')}@fastpay`;

// Signup Route
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const upiId = generateUPIId();
    const user = new User({ name, email, password, upiId });
    await user.save();

    res.status(201).json({ message: 'User registered successfully', upiId });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Login Route
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful', upiId: user.upiId, balance: user.balance });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Fetch User Route
app.get('/api/user/:upiId', async (req, res) => {
  try {
    const user = await User.findOne({ upiId: req.params.upiId });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Transaction Route
app.post('/api/transaction', async (req, res) => {
  try {
    const { sender_upi_id, receiver_upi_id, amount } = req.body;

    const sender = await User.findOne({ upiId: sender_upi_id });
    const receiver = await User.findOne({ upiId: receiver_upi_id });

    if (!sender || !receiver) return res.status(404).json({ message: 'User(s) not found' });
    if (sender.balance < amount) return res.status(400).json({ message: 'Insufficient balance' });

    sender.balance -= amount;
    receiver.balance += amount;
    await sender.save();
    await receiver.save();

    const transaction = new Transaction({ sender_upi_id, receiver_upi_id, amount });
    await transaction.save();

    res.status(200).json({ message: 'Transaction successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Fetch Transactions Route
app.get('/api/transactions/:upiId', async (req, res) => {
  try {
    const transactions = await Transaction.find({
      $or: [{ sender_upi_id: req.params.upiId }, { receiver_upi_id: req.params.upiId }],
    }).sort({ timestamp: -1 });

    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB');
  });
  
  mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
  });
  
  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from MongoDB');
  });
