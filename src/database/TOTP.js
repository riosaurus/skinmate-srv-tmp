const { Schema, model } = require('mongoose');
const speakeasy = require('speakeasy');

/**
 * Client schema
 */
const schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  secret: String,
}, {
  timestamps: true,
});

/**
 * Pre save hook to sign a JWT
 */
schema.pre('save', function preSave() {
  const secret = speakeasy.generateSecret({ length: 20 });
  this.secret = secret.base32;
});

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
module.exports = model('TOTP', schema);
