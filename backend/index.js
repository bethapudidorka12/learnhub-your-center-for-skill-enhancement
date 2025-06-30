const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/config');

// Import route files
const userRoutes = require('./routers/userRoutes');      // For login, register
const adminRoutes = require('./routers/adminRoutes');    // For admin dashboard
const courseRoutes = require('./routers/courseRoutes');  // For course, enroll, progress, certificate

dotenv.config();      // Load environment variables
connectDB();          // Connect to MongoDB

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);        // /api/users/register, /api/users/login
app.use('/api/admin', adminRoutes);       // /api/admin/users, /api/admin/enrollments/:id
app.use('/api/courses', courseRoutes);    // /api/courses/create, /api/courses/enroll/:id etc.

// ✅ Optional test route
app.get('/', (req, res) => {
  res.send('✅ LMS API is running!');
});

// Server start
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
