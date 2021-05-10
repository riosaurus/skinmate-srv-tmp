const { Schema, model } = require('mongoose');
const validator = require('validator');

/**
 * Family schema
 */
const schema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  relationship: {
    type: String,
    required: true,
    trim: true,
  },
  gender: {
    type: String,
    required: true,
    trim: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  bloodGroup: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  insurance: {
    type: String,
    trim: true,
  },
  emergencyName: {
    type: String,
    trim: true,
  },
  emergencyNumber: {
    type: String,
    trim: true,
    validate: { validator: validator.isMobilePhone, message: 'Invalid phone number' },
  },
});

/**
 * Family model
 */
module.exports = model('Family', schema);
