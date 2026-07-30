const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Service = require('../models/Service');


// SIGNUP
router.post('/signup', async (req, res) => {
  try {
    const {
      name, username, password, address,
      accountType, // "user" or "vendor"
      serviceType, businessName, serviceDescription, serviceTiming,
      longitude, latitude
    } = req.body;

    const existingUser = await User.findOne({ username: username?.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'Username is already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      username,
      password: hashedPassword,
      address,
      isVendor: accountType === 'vendor',
      vendorInfo: accountType === 'vendor'
        ? { serviceType, businessName, serviceDescription, serviceTiming }
        : {}
    });

    await newUser.save();

    // If signing up as a vendor, auto-create their Service listing
    if (accountType === 'vendor') {
      const newService = new Service({
        name: businessName || name,
        category: serviceType,
        description: serviceDescription,
        location: {
          type: 'Point',
          coordinates: [longitude || 0, latitude || 0]
        },
        addedBy: newUser._id
      });
      await newService.save();
    }

    res.status(201).json({ message: 'Account created successfully' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username: username?.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, username: user.username }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;