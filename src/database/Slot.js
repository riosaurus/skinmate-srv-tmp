const { Schema, model } = require('mongoose');

const schema = new Schema({
  parent: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Slots',
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

schema.index({ parent: 1, from: 1 }, { unique: true });

// <hooks>

// </hooks>

module.exports = model('Slot', schema);
