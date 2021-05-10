const { Schema, model } = require('mongoose');

/**
 * Service model
 */
const serviceSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: String,
  staff: [{
    type: Schema.Types.ObjectId,
    ref: 'Doctor',
  }],
  sub: [{
    type: Schema.Types.ObjectId,
    ref: 'Service',
  }],
}, {
  timestamps: true,
});

module.exports = model('Service', serviceSchema);
