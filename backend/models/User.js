const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  isVendor: {
    type: Boolean,
    default: false
  },
  vendorInfo: {
    serviceType: { type: String, default: '' },
    businessName: { type: String, default: '' },
    serviceDescription: { type: String, default: '' },
    serviceTiming: { type: String, default: '' }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);