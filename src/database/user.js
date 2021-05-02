const { Schema, model } = require('mongoose');
const { genSalt, hash } = require('bcryptjs');
const validator = require('validator');

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
    trim: true,
    unique: true,
    validate: { validator: validator.isMobilePhone, message: 'Invalid phone number' },
  },
  password: {
    type: String,
    required: true,
    validate: { validator: validator.isStrongPassword, message: 'Weak password' },
  },
  name: {
    type: String,
    trim: true,
    default: 'User',
  },
  address: {
    type: String,
    trim: true,
    required: true,
  },
  
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
  avatar: {
    type: Buffer,
    default: 123,
  },
}, {
  timestamps: true,
});

usersSchema.virtual('appointments', {
  ref: 'Appointment',
  localField: '_id',
  foreignField: 'appointmentOwner',
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

// schema.methods.toJSON=async function(){
//   let user=this
//    let userObject=user.toObject()
//    delete userObject.password
//    return userObject
// }
/**
 * User model
 */
module.exports = model('User', usersSchema);
