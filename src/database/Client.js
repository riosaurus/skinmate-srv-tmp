const { Schema, model } = require('mongoose');
const { sign, verify } = require('jsonwebtoken');
const constants = require('../utils/variables');

function tokenValidator() {
  try {
    if (verify(this.token, constants.token())) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}

/**
 * Client schema
 */
const schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userAgent: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    unique: true,
    validate: { validator: tokenValidator, message: 'Invalid token' },
  },
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
