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
      name, email, password, mobileNumber, address,
      accountType, // "user" or "vendor"
      serviceType, businessName, serviceDescription, serviceTiming,
      longitude, latitude
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      mobileNumber,
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
        contact: mobileNumber,
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
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
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
      user: { id: user._id, name: user.name, email: user.email }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;