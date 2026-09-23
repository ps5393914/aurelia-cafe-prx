require('dotenv').config({ path: '../.env' }); // Load .env from root
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect Database
if (process.env.MONGO_URI) {
  connectDB();
} else {
  console.log('No MONGO_URI found in .env, skipping DB connection for now.');
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const contactRoutes = require('./routes/contactRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/contact', contactRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
