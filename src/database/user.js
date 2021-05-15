const { Schema, model } = require('mongoose');
const { genSalt, hash } = require('bcryptjs');
const validator = require('validator');
const customValidators = require('../utils/validators');

/**
 * User schema
 */
const usersSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    toLowerCase: true,
    validate: { validator: validator.isEmail, message: 'Invalid email address' },
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: { validator: validator.isMobilePhone, message: 'Invalid phone number' },
  },
  password: {
    type: String,
    required: true,
    validate: { validator: validator.isStrongPassword, message: 'Weak password' },
  },
  firstName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  gender: {
    type: String,
    trim: true,
  },
  dateOfBirth: Date,
  bloodGroup: {
    type: String,
    trim: true,
    validate: { validator: customValidators.isValidBloodGroup, message: 'Unknown blood group' },
  },
  address: {
    type: String,
    trim: true,
  },
  insurance: [{
    type: String,
    trim: true,
  }],
  family: [{
    type: Schema.Types.ObjectId,
    ref: 'Family',
  }],
  emergencyName: {
    type: String,
    trim: true,
  },
  emergencyNumber: {
    type: String,
    trim: true,
    validate: { validator: validator.isMobilePhone, message: 'Invalid phone number' },
  },
  verifiedPhone: {
    type: Boolean,
    default: false,
  },
  verifiedEmail: {
    type: Boolean,
    default: false,
  },
  elevatedAccess: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  clients: [{
    type: Schema.Types.ObjectId,
    ref: 'Client',
  }],
  avatar: Buffer,
}, {
  timestamps: true,
});

usersSchema.virtual('appointments', {
  ref: 'Appointment',
  localField: '_id',
  foreignField: 'userId',
});

/**
 * Pre save hook to hash password on user creation & password updation
 */
usersSchema.pre('save', async function preSave() {
  if (this.isModified('password')) {
    const salt = await genSalt(8);
    const hashed = await hash(this.password, salt);
    this.password = hashed;
  }
});

/**
 * User model
 */
module.exports = model('User', usersSchema);
