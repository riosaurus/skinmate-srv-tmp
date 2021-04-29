const { Schema, model } = require('mongoose');
const { sign } = require('jsonwebtoken');
const { Environment } = require('../utils');

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
  },
}, {
  timestamps: true,
});

/**
 * Pre save hook to sign a JWT
 */
schema.pre('save', function preSave() {
  this.token = sign(this.id, Environment.token());
});

/**
 * Creates a new device access document
 * @param {Document<User>} user User instance
 * @param {string} userAgent user-agent from incoming request
 * @returns {Document<Client>}
 */
schema.statics.addDevice = function addDevice(user, userAgent) {
  return this.create({ user, userAgent });
};

/**
 * Remove all devices belonging to user
 * @param {Document<User>} user User instance
 * @returns delete info
 */
schema.statics.removeUserDevices = function removeUserDevices(user) {
  return this.deleteMany({ user });
};

/**
 * Find a device asscociated with the device
 * @param {string} token JWT token
 * @returns {Document<Client>} Client document
 */
schema.statics.findByToken = function findByToken(token) {
  return this.findOne({ token });
};

/**
 * Client model
 */
module.exports = model('Client', schema);
