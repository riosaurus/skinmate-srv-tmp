const { Schema, model } = require('mongoose');
const { sign } = require('jsonwebtoken');
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
  }
}, {
  timestamps: true,
});

/**
 * Pre save hook to sign a JWT
 */
schema.pre('save', function preSave() {
  this.token = sign(this.id, constants.token());
});

/**
 * Client model
 */
module.exports = model('Client', schema);
