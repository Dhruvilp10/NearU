const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Service = require('../models/Service');
const authMiddleware = require('../middleware/authMiddleware');

// ADD A REVIEW
router.post('/add', authMiddleware, async (req, res) => {
  try {
    const { serviceId, rating, comment } = req.body;

    const newReview = new Review({
      service: serviceId,
      user: req.userId,
      rating,
      comment
    });

    await newReview.save();

    // Recalculate average rating for that service
    const allReviews = await Review.find({ service: serviceId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await Service.findByIdAndUpdate(serviceId, { avgRating: avgRating.toFixed(1) });

    res.status(201).json({ message: 'Review added', review: newReview });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET ALL REVIEWS FOR A SERVICE
router.get('/:serviceId', async (req, res) => {
  try {
    const reviews = await Review.find({ service: req.params.serviceId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;