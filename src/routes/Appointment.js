const express = require('express')
const router = new express.Router()
const Users = require('../database/User')
const Doctor = require('../database/Doctor')
const Appointment = require('../database/Appointment')



router.post('/appointment/create',async(req,res)=>{
    try{
        const appointment = new Appointment({
            doctorId:req.body.id,
            userId:req.body.ownerid,
            date:req.body.date,
            time:req.body.time
        })
    await appointment.save()
    const doctor =  await Doctor.findById({_id:req.body.id})
    let bool = false
    const date = new Date(req.body.date)
    for(let i = 0;i<doctor.busySlots.length;i++){
        if(doctor.busySlots[i].date.getTime()===date.getTime()){
            doctor.busySlots[i].time = doctor.busySlots[i].time.concat(req.body.time)
            bool = true
        }
    }
    if(bool===false){
            doctor.busySlots = doctor.busySlots.concat({
            date:req.body.date,
            time:req.body.time
        })
    }
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
                doctorEducation:doctor.qualification,
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
        const doctor = await Doctor.findById({_id:appointment.doctorId})
        res.send({
            doctorName:doctor.name,
            doctorEducation:doctor.qualification,
            appointmentDate:appointment.date,
            appointmentTime:appointment.time[0],
            id:appointment._id
        })
    }
    catch(e){
        res.send(e)
    }
})



router.post('/appointment/cancel',async(req,res)=>{
    try{
        const appointment = await Appointment.findById(req.body.id)
        const doctor = await Doctor.findById(appointment.doctorId)
        const dtime = appointment.time
        const ddate = appointment.date
        let index
        for(let i=0;i<doctor.busySlots.length;i++){
            if(doctor.busySlots[i].date.getTime() === ddate.getTime()){   
                index = i
                break
            }   
        }  
        const array = doctor.busySlots[index].time.filter(tim => !dtime.includes(tim))
        doctor.busySlots[index].time = array
        if (doctor.busySlots[index].time.length===0){
            doctor.busySlots.splice(index,1)
        }
        await doctor.save()
        res.send({
            doctorName:doctor.name,
            doctorEducation:doctor.qualification,
            appointmentDate:appointment.date,
            appointmentTime:appointment.time[0]

        })
    }     
    catch(e){
        res.send(e)
    }
})



module.exports = router







