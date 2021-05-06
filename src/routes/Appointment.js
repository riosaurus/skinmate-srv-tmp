const express = require('express')
const router = new express.Router()
const Users = require('../database/User')
const Doctor = require('../database/Doctor')
const Appointment = require('../database/Appointment')
const { User, Client } = require('../database')
const { middlewares, errors } = require('../utils')


router.post(
    '/appointment/create',
    urlencoded({ extended: true }),
    middlewares.requireHeaders({ accessToken: true, deviceId: true }),
    middlewares.requireVerification({ phone: true, email: true }),
    async(req,res)=>{
    try{
          const client = await Client.findOne({
            _id: request.headers['device-id'],
            token: request.headers['access-token'],
          });
    
          if (!client) {
            response.status(403);
            throw new Error('Unrecognized device');
          }
    
          const user = await User.findOne({
            _id: client.user,
            isDeleted: { $ne: true },
          });
    
          if (!user) {
            response.status(404);
            throw new Error('Account not found');
          }

        const appointment = new Appointment({
            doctorId:req.body.doctorid,
            userId:user._id,
            date:req.body.date,
            time:req.body.time
        })
        await appointment.save()


        const doctor =  await Doctor.findById({_id:req.body.doctorid})
        if(!doctor){
            res.status(403)
            throw new Error('Doctor could not be found')
        }
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


router.patch(
    '/appointment/reschedule',
    urlencoded({ extended: true }),
    middlewares.requireHeaders({ accessToken: true, deviceId: true }),
    middlewares.requireVerification({ phone: true, email: true }),
    async(req,res)=>{
    try{
        const client = await Client.findOne({
            _id: request.headers['device-id'],
            token: request.headers['access-token'],
          });
    
          if (!client) {
            response.status(403);
            throw new Error('Unrecognized device');
          }
    
          const user = await User.findOne({
            _id: client.user,
            isDeleted: { $ne: true },
          });
    
          if (!user) {
            response.status(404);
            throw new Error('Account not found');
          }


        const appointment = await Appointment.findById(req.body.appointmentid)
        if(!appointment){
            res.status(403)
            throw new Error('Appointment could not be found')
        }
        const doctor = await Doctor.findById(appointment.doctorId)
        const dtime = appointment.time
        const ddate = appointment.date
        await appointment.updateOne({
            date : req.body.date,
            time : req.body.time
        },{new: true})
        await appointment.save()
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


router.delete(
    '/appointment/cancel',
    urlencoded({ extended: true }),
    middlewares.requireHeaders({ accessToken: true, deviceId: true }),
    middlewares.requireVerification({ phone: true, email: true }),
    async(req,res)=>{
    try{
        const client = await Client.findOne({
            _id: request.headers['device-id'],
            token: request.headers['access-token'],
          });
    
          if (!client) {
            response.status(403);
            throw new Error('Unrecognized device');
          }
    
          const user = await User.findOne({
            _id: client.user,
            isDeleted: { $ne: true },
          });
    
          if (!user) {
            response.status(404);
            throw new Error('Account not found');
          }


        const appointment = await Appointment.findById(req.body.appointmentid)
        if(!appointment){
            res.status(403)
            throw new Error('Appointment could not be found')
        }
        const doctor = await Doctor.findById(appointment.doctorId)
        const dtime = appointment.time
        const ddate = appointment.date
        await appointment.remove()
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
            appointmentDate:ddate,
            appointmentTime:dtime[0]

        })
    }     
    catch(e){
        res.send(e)
    }
})



router.post(
    '/myappointments',
    urlencoded({ extended: true }),
    middlewares.requireHeaders({ accessToken: true, deviceId: true }),
    middlewares.requireVerification({ phone: true, email: true }),
    async (req,res)=>{
    try{
        const client = await Client.findOne({
            _id: request.headers['device-id'],
            token: request.headers['access-token'],
          });
    
          if (!client) {
            response.status(403);
            throw new Error('Unrecognized device');
          }
    
          const user = await User.findOne({
            _id: client.user,
            isDeleted: { $ne: true },
          });
    
          if (!user) {
            response.status(404);
            throw new Error('Account not found');
          }


        // const user = await Users.findById({_id:req.body.userid})
        await user.populate('appointments').execPopulate()
        if(user.appointments.length===0){
            res.send("No Appointments to show")
        }
        var array = []
        for(let i = 0;i<user.appointments.length;i++){
            let doctor = await Doctor.findById({_id:user.appointments[i].doctorId})
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



router.post('/appointment/confirm',
    urlencoded({ extended: true }),
    middlewares.requireHeaders({ accessToken: true, deviceId: true }),
    middlewares.requireVerification({ phone: true, email: true }),
    async(req,res)=>{
    try{
        const client = await Client.findOne({
            _id: request.headers['device-id'],
            token: request.headers['access-token'],
          });
    
          if (!client) {
            response.status(403);
            throw new Error('Unrecognized device');
          }
    
          const user = await User.findOne({
            _id: client.user,
            isDeleted: { $ne: true },
          });
    
          if (!user) {
            response.status(404);
            throw new Error('Account not found');
          }

        const appointment = await Appointment.findById({_id:req.body.appointmentid})
        if(!appointment){
            res.status(403)
            throw new Error('Appointment could not be found')
        }
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



module.exports = router







