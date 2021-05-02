const { Schema, model } = require('mongoose');
const { sign } = require('jsonwebtoken');
const validator = require('validator');
const { constants } = require('../utils');

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
    validate: { validator: validator.default.isJWT, message: 'Invalid token' },
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
<<<<<<< HEAD
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
=======
>>>>>>> 65701f1612d7296b511bd70edeee5c9fae97b536
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
