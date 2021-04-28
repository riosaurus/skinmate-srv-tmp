const mongoose = require('mongoose')

const appointmentSchema = new mongoose.Schema({
    doctorDetails:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Doctor'
    },
    appointmentOwner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    slots:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Slots'
    }
},{
    timestamps:true
})


const Appointment = mongoose.model('Appointment',appointmentSchema)

module.exports = Appointment
