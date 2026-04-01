const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const categoryRoutes = require('./routes/categoryRoutes');


const app = express();
const PORT = process.env.PORT || 5000;


connectDB();

// Auto-create uploads directory
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:5174',
  'https://opendooor.netlify.app'
];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/categories', categoryRoutes);


app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running', 
    timestamp: new Date().toISOString() 
  });
});


app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'API endpoint not found' 
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error' 
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
