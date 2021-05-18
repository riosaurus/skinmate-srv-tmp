const { Schema, model } = require('mongoose');
const { sign, verify } = require('jsonwebtoken');
const validator = require('validator');
const constants = require('../utils/variables');

/**
 * Client schema
 */
const schema = new Schema({
  userAgent: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    unique: true,
    validate: { validator: validator.default.isJWT, message: 'Invalid token' },
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

/**
 * Pre save hook to sign a JWT
 */
schema.pre('save', function preSave() {
  const { token, ...payload } = this.toJSON();
  this.token = sign(payload, constants.token());
});

/**
 * Method to verify token
 */
schema.methods.isValid = async function isValid() {
  try {
    verify(this.token, constants.token());
    return true;
  } catch (error) {
    this.isDeleted = true;
    await this.save();
    return false;
  }
};

/**
 * Client model
 */
module.exports = model('Client', schema);
