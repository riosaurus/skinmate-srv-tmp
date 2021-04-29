const { Schema, model } = require('mongoose');

const schema = new Schema({
  day: {
    type: Number,
    min: 0,
    max: 6,
  },
  doctor: {
    type: Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
  },
  slots: [{
    type: Schema.Types.ObjectId,
    ref: 'Slot',
  }],
}, {
  timestamps: true,
});

schema.index({ day: 1, doctor: 1 }, { unique: true });

module.exports = model('Slots', schema);
