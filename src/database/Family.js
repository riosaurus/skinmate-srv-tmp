const { Schema, model } = require('mongoose');
const validator = require('validator');
const customValidators = require('../utils/validators');


/**
 * Family schema
 */
const schema = new Schema({
  user : {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
},
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
    validate: { validator: customValidators.isValidGender, message: 'Invalid gender' },
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  bloodGroup: {
    type: String,
    required: true,
    trim: true,
    validate: { validator: customValidators.isValidBloodGroup, message: 'Unknown blood group' },
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
