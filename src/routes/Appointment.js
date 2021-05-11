const express = require('express')
const router = new express.Router()
const { User, Client,Appointment,Doctor } = require('../database')
//const User = require('../database/User')
//const Doctor = require('../database/Doctor')
//const Appointment = require('../database/Appointment')

const { middlewares, errors } = require('../utils')
const { urlencoded, request } = require('express')

router.post(
  '/appointment/create',
  express.json(),
  middlewares.requireHeaders({ accessToken: true, deviceId: true }),
  middlewares.requireVerification({ phone: true, email: true }),
  async (req,res)=>{
     try{
        const client = await Client.findOne({
          _id: req.headers['device-id'],
          token: req.headers['access-token'],
        })
      
  
        if (!client) {
          res.status(403);
          throw new Error('Unrecognized device');
        }
  
        const user = await User.findOne({
          _id: client.user,
          isDeleted: { $ne: true },
        });
  
        if (!user) {
          res.status(404);
          throw new Error('Account not found');
        }

      const appointment = new Appointment({
          doctorId:req.body.doctorid,
          userId:user._id,
          date:req.body.date,
          time:req.body.time,
          paymentType:req.body.paymentType,
          insuranceInfo:req.body.insuranceInfo,
          appointmentFor:req.body.appointmentFor
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
      res.status(201).send("Appointment scheduled successfully")
}
catch(e){
  res.status(500).send(e)
}
})



router.patch(
    '/appointment/reschedule/:id',
    express.json(),
    middlewares.requireHeaders({ accessToken: true, deviceId: true }),
    middlewares.requireVerification({ phone: true, email: true }),
    async(req,res)=>{
    try{
        const client = await Client.findOne({
            _id: req.headers['device-id'],
            token: req.headers['access-token'],
          });
    
          if (!client) {
            res.status(403);
            throw new Error('Unrecognized device');
          }
    
          const user = await User.findOne({
            _id: client.user,
            isDeleted: { $ne: true },
          });
    
          if (!user) {
            res.status(404);
            throw new Error('Account not found');
          }


        const appointment = await Appointment.findById(req.params.id)
        if(!appointment){
            res.status(404)
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
        res.status(200).send({
            doctorName:doctor.name,
            doctorEducation:doctor.qualification,
            appointmentDate:req.body.date,
            appointmentTime:req.body.time[0]
        })

    }
    catch(e){
        res.status(500).send(e)
    }
})


router.delete(
    '/appointment/cancel/:id',
    express.json(),
    middlewares.requireHeaders({ accessToken: true, deviceId: true }),
    middlewares.requireVerification({ phone: true, email: true }),
    async(req,res)=>{
    try{
        const client = await Client.findOne({
            _id: req.headers['device-id'],
            token: req.headers['access-token'],
          });
    
          if (!client) {
            res.status(403);
            throw new Error('Unrecognized device');
          }
    
          const user = await User.findOne({
            _id: client.user,
            isDeleted: { $ne: true },
          });
    
          if (!user) {
            res.status(404);
            throw new Error('Account not found');
          }


        const appointment = await Appointment.findById(req.params.id)
        if(!appointment){
            res.status(404)
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
        res.status(200).send({
            doctorName:doctor.name,
            doctorEducation:doctor.qualification,
            appointmentDate:ddate,
            appointmentTime:dtime[0]

        })
    }     
    catch(e){
        res.status(500).send(e)
    }
})



router.get(
    '/myappointments',
    express.json(),
    middlewares.requireHeaders({ accessToken: true, deviceId: true }),
    middlewares.requireVerification({ phone: true, email: true }),
    async (req,res)=>{
    try{
        const client = await Client.findOne({
            _id: req.headers['device-id'],
            token: req.headers['access-token'],
          });
    
          if (!client) {
            res.status(403);
            throw new Error('Unrecognized device');
          }
    
          const user = await User.findOne({
            _id: client.user,
            isDeleted: { $ne: true },
          });
    
          if (!user) {
            res.status(404);
            throw new Error('Account not found');
          }


        // const user = await Users.findById({_id:req.body.userid})
        await user.populate('appointments').execPopulate()
        if(user.appointments.length===0){
            res.status(200).send("No Appointments to show")
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
        res.status(200).send(array)
    }
    catch(e){
        res.status(500).send(e)
    }
})


router.get('/appointment/details',
    express.json(),
    middlewares.requireHeaders({ accessToken: true, deviceId: true }),
    middlewares.requireVerification({ phone: true, email: true }),
    async(req,res)=>{
    try{
        const client = await Client.findOne({
            _id: req.headers['device-id'],
            token: req.headers['access-token'],
          });
    
          if (!client) {
            res.status(403);
            throw new Error('Unrecognized device');
          }
    
          const user = await User.findOne({
            _id: client.user,
            isDeleted: { $ne: true },
          });
    
          if (!user) {
            res.status(404);
            throw new Error('Account not found');
          }

        let familymembers = await Family.find({user:user._id})
        let family = []
        for(let i=0;i<familymembers.length;i++){
          family = family.concat(familymembers[i].firstName)
        }
        res.status(200).send({
            family,
            insuranceInfo:user.insurance
        })
    }
    catch(e){
        res.status(500).send(e)
    }
})

router.post('/appointment/insurance',
    express.json(),
    middlewares.requireHeaders({ accessToken: true, deviceId: true }),
    middlewares.requireVerification({ phone: true, email: true }),
    async(req,res)=>{
    try{
        const client = await Client.findOne({
            _id: req.headers['device-id'],
            token: req.headers['access-token'],
          });

          if (!client) {
            res.status(403);
            throw new Error('Unrecognized device');
          }

          const user = await User.findOne({
            _id: client.user,
            isDeleted: { $ne: true },
          });

          if (!user) {
            res.status(404);
            throw new Error('Account not found');
          }
          user.insurance = user.insurance.concat(req.body.insurance)
          await user.save()
          res.status(201).send("New insurance added successfully")
        }

          catch(e){
            res.status(500).send(e)
          }
  })


module.exports = router







