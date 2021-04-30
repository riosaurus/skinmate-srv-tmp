const { Schema, model } = require('mongoose');
const validator = require('validator');

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
  busySlots:[{
    date:{
        type:Date,
    },
    time:[{
        type:String
    }]
}     
]
});

module.exports = model('Doctor', schema);
