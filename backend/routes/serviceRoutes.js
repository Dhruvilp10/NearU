const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const authMiddleware = require('../middleware/authMiddleware');

// ADD A NEW SERVICE
router.post('/add', authMiddleware, async (req, res) => {
  try {
    const { name, category, description, contact, longitude, latitude } = req.body;

    const newService = new Service({
      name,
      category,
      description,
      contact,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude]
      },
      addedBy: req.userId
    });

    await newService.save();
    res.status(201).json({ message: 'Service added successfully', service: newService });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET ALL SERVICES
router.get('/all', async (req, res) => {
  try {
    const services = await Service.find({ reported: false }).sort({ createdAt: -1 });
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET ONE SERVICE (details page)
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// FIND NEARBY SERVICES (the geolocation feature)
router.get('/nearby/search', async (req, res) => {
  try {
    const { longitude, latitude, maxDistance } = req.query;

    const services = await Service.find({
      reported: false,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: maxDistance ? parseInt(maxDistance) : 5000 // default 5km
        }
      }
    });

    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// UPDATE STATUS (Open/Closed/Busy) — ONLY the owner can do this (Feature 7)
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const service = await Service.findById(req.params.id);

    if (!service) return res.status(404).json({ message: 'Service not found' });

    // Ownership check
    if (service.addedBy.toString() !== req.userId) {
      return res.status(403).json({ message: 'You are not authorized to update this service' });
    }

    service.status = status;
    await service.save();

    res.status(200).json({ message: 'Status updated', service });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// REPORT A LISTING (Feature 4)
router.put('/:id/report', authMiddleware, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });

    service.reportCount += 1;
    if (service.reportCount >= 3) {
      service.reported = true; // auto-hide after 3 reports
    }
    await service.save();

    res.status(200).json({ message: 'Service reported', service });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE SERVICE (only owner)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });

    if (service.addedBy.toString() !== req.userId) {
      return res.status(403).json({ message: 'You are not authorized to delete this service' });
    }

    await service.deleteOne();
    res.status(200).json({ message: 'Service deleted' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;