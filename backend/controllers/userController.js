const User = require('../schemas/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ✅ Register
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, type } = req.body;

    const userExist = await User.findOne({ email });
    if (userExist) return res.status(400).json({ error: 'User already exists' });

    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashPassword, type });
    await user.save();

    // Generate token
    const token = jwt.sign(
      { id: user._id, type: user.type },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        type: user.type
      }
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: 'Server error' });
  }
};

// ✅ Login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, type: user.type },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        type: user.type
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: 'Server error' });
  }
};

// ✅ Admin Login
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.type !== 'admin') {
      return res.status(403).json({ error: 'Access denied: Not an admin' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, type: user.type },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        type: user.type
      }
    });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ error: 'Server error' });
  }
};