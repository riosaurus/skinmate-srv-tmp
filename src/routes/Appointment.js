const express = require('express')
const router = new express.Router()
const Users = require('../database/User')
const Doctor = require('../database/Doctor')
const Appointment = require('../database/Appointment')



router.post('/appointment/create',async(req,res)=>{
    try{
        const appointment = new Appointment({
            doctorDetails:req.body.id,
            appointmentOwner:req.body.ownerid,
            date:req.body.date,
            time:req.body.time
        })
    await appointment.save()
    const doctor =  await Doctor.findById({_id:req.body.id})
    doctor.busySlots = doctor.busySlots.concat({
        date:req.body.date,
        time:req.body.time
    })
    await doctor.save()
    res.send({
        type:"Medical",
        date:req.body.date,
        time:req.body.time[0],
        id:appointment._id, 
    })
}
catch(e){
    res.send(e)
}
})



router.post('/myappointments',async (req,res)=>{
    try{
        const user = await Users.findById({_id:req.body.id})
        await user.populate('appointments').execPopulate()
        var array = []
        for(let i = 0;i<user.appointments.length;i++){
            let doctor = await Doctor.findById({_id:user.appointments[i].doctorDetails})
            let obj = {
                date:user.appointments[i].date,
                time:user.appointments[i].time[0],
                doctorName:doctor.name,
                doctorEducation:doctor.education,
                appointmentid:user.appointments[i]._id
            }
            array = array.concat(obj)
        }
        res.send(array)
    }
    catch(e){
        res.send(e)
    }
})


router.post('/appointment/confirm',async(req,res)=>{
    try{
        const appointment = await Appointment.findById({_id:req.body.id})
        const doctor = await Doctor.findById({_id:appointment.doctorDetails})
        res.send({
            doctorName:doctor.name,
            doctorEducation:doctor.education,
            appointmentDate:appointment.date,
            appointmentTime:appointment.time[0],
            id:appointment._id
        })
    }
    catch(e){
        res.send(e)
    }
})




module.exports = router







