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
    trim: true,
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
  devices: [{
    type: Schema.Types.ObjectId,
    ref: 'Client',
  }],
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
    default: true,
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
  return this.findOne({ email, isDeleted: { $ne: true } });
};

/**
 * Method to compare a plaintext password against the instance hash.
 * @param {string} password plaintext
 * @returns {Promise<boolean>}
 */
schema.methods.isPasswordMatch = async function isPasswordMatch(password) {
  return compare(password, this.password);
};

/**
 * Method to add the client access to user devices
 * @param {Client} client Client instance
 * @returns {void}
 */
schema.methods.linkClient = async function addClient(client) {
  this.devices.push(client);
};

/**
 * Method to remove a client from user devices
 * @param {Client} client Client instance
 * @returns {void}
 */
schema.methods.unlinkClient = async function removeClient(client) {
  this.devices = this.devices.filter((device) => device.id !== client.id);
};

/**
 * Method to remove complete client access for the user.
 * (Logout everywhere)
 * @returns {void}
 */
schema.methods.removeAllClients = function removeClient() {
  this.devices = [];
};

/**
 * Method to activate a user (restore)
 * @returns {void}
 */
schema.methods.activate = function activate() {
  if (!this.isDeleted) throw new Error('Already active');
  this.isDeleted = false;
};

/**
 * Method to soft-delete a user
 * @returns {void}
 */
schema.methods.deactivate = function deactivate() {
  if (this.isDeleted) throw new Error('Already deactivated');
  this.isDeleted = true;
};

/**
 * User model
 */
module.exports = model('User', schema);
