const { Schema, model } = require('mongoose');

const schema = new Schema({
  doctor: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Doctor',
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  slot: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Slots',
  },
}, {
  timestamps: true,
});

module.exports = model('Appointment', schema);
