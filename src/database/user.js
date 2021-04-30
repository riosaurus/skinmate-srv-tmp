const { Schema, model } = require('mongoose');
const { genSalt, hash, compare } = require('bcryptjs');
const validator = require('validator');

/**
 * User schema
 */
const schema = new Schema({
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
    trim: true,
    unique: true,
    validate: {
      validator: validator.isMobilePhone,
      message: 'Invalid phone number',
    },
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: validator.isStrongPassword,
      message: 'Weak password',
    },
  },
  name: {
    type: String,
    trim: true,
    default: 'User',
  },
  address: {
    type: String,
    required: true,
  },
  family: [],
  verifiedPhone: {
    type: Boolean,
    default: false,
  },
  verifiedEmail: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

/**
 * Pre save hook to hash password on user creation & password updation
 */
schema.pre('save', async function preSave() {
  if (this.isModified('password')) {
    const salt = await genSalt(8);
    const hashed = await hash(this.password, salt);
    this.password = hashed;
  }
});

/**
 * Static method to find a user by email
 * @param {string} email
 * @returns {Promise<Document | null>} User Document or null if user doesn't exist
 */
schema.statics.findByEmail = async function findByEmail(email) {
  if (!validator.default.isEmail(email)) {
    throw new Error('Provide a valid email address');
  }
  return this.findOne({ email, isDeleted: { $ne: true } });
};

/**
 * Method to compare a plaintext password against the instance hash.
 * @param {string} password plaintext
 * @returns {Promise<boolean>}
 */
schema.methods.isPasswordMatch = async function isPasswordMatch(password) {
  // const hashed = await this.select('password').exec();
  return compare(password, this.password);
};

/**
 * User model
 */
module.exports = model('User', schema);
