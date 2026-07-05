const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Service = require('../models/Service');
const authMiddleware = require('../middleware/authMiddleware');

// GET MY OWN PROFILE
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    let photo = '';
    if (user.isVendor) {
      const myService = await Service.findOne({ addedBy: req.userId });
      photo = myService?.photo || '';
    }
    res.status(200).json({ ...user.toObject(), photo });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET ALL VENDORS (with optional search/filter)
router.get('/vendors', async (req, res) => {
  try {
    const { search, serviceType } = req.query;

    let filter = { isVendor: true };

    if (serviceType) {
      filter['vendorInfo.serviceType'] = { $regex: serviceType, $options: 'i' };
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'vendorInfo.businessName': { $regex: search, $options: 'i' } },
        { 'vendorInfo.serviceType': { $regex: search, $options: 'i' } }
      ];
    }

    const vendors = await User.find(filter).select('-password');
    res.status(200).json(vendors);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET ONE VENDOR'S PROFILE + THEIR LISTINGS
router.get('/vendor/:id', async (req, res) => {
  try {
    const vendor = await User.findById(req.params.id).select('-password');
    if (!vendor || !vendor.isVendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    const listings = await Service.find({ addedBy: req.params.id, reported: false });
    res.status(200).json({ vendor, listings });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// UPGRADE MY ACCOUNT: USER → VENDOR
router.put('/upgrade-to-vendor', authMiddleware, async (req, res) => {
  try {
    const { serviceType, businessName, serviceDescription, serviceTiming, longitude, latitude } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isVendor = true;
    user.vendorInfo = { serviceType, businessName, serviceDescription, serviceTiming };
    await user.save();

    // Auto-create their Service listing
    const newService = new Service({
      name: businessName || user.name,
      category: serviceType,
      description: serviceDescription,
      contact: user.mobileNumber,
      location: {
        type: 'Point',
        coordinates: [longitude || 0, latitude || 0]
      },
      addedBy: user._id
    });
    await newService.save();

    res.status(200).json({ message: 'Account upgraded to Vendor', user, service: newService });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// EDIT MY OWN PROFILE (works for both User and Vendor)
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const {
      name, mobileNumber, address,
      serviceType, businessName, serviceDescription, serviceTiming, photoUrl
    } = req.body;

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (mobileNumber) user.mobileNumber = mobileNumber;
    if (address) user.address = address;

    if (user.isVendor) {
      if (serviceType) user.vendorInfo.serviceType = serviceType;
      if (businessName) user.vendorInfo.businessName = businessName;
      if (serviceDescription) user.vendorInfo.serviceDescription = serviceDescription;
      if (serviceTiming) user.vendorInfo.serviceTiming = serviceTiming;
    }

    await user.save();

    // Keep the public listing in sync with profile edits
    if (user.isVendor) {
      const service = await Service.findOne({ addedBy: user._id });
      if (service) {
        if (businessName) service.name = businessName;
        if (serviceType) service.category = serviceType;
        if (serviceDescription) service.description = serviceDescription;
        if (mobileNumber) service.contact = mobileNumber;
        if (photoUrl) service.photo = photoUrl;
        await service.save();
      }
    }

    res.status(200).json({ message: 'Profile updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;