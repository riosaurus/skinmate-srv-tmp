const { Schema, model } = require('mongoose');

const schema = new Schema({
  doctorId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Doctor',
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  date:{
    type:Date,
    required:true
    },
  time:[{
        type:String,
        required:true
    }]  
}, {
  timestamps: true,
});

module.exports = model('Appointment', schema);
