const { Schema, model } = require('mongoose');
const validator = require('validator');

<<<<<<< HEAD
const _schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        toLowerCase: true,
        validate: { validator: validator.isEmail, message: "Invalid email address" }
    },
    phone:{
        type: String,
        required: true,
        trim:true,
        validate: { validator: validator.isMobilePhone, message: "Invalid phone number" }  
    },
    avatar: {
        type: Buffer,
        default: []
    },
    qualification: {
        type: String,
        required: true,
    },
    slots: {
        type:Schema.Types.ObjectId,
        default:[],
        ref: 'Slots'
        
    }
=======
const schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
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
  },
  avatar: {
    type: Buffer,
    default: [],
  },
  qualification: {
    type: String,
    required: true,
  },
  slots: {
    type: Schema.Types.ObjectId,
    default: [],
    ref: 'Slots',
  },
>>>>>>> 882b4228f4942b9c3aeae3851ce841b9fe55401a
});

module.exports = model('Doctor', schema);
