const express = require('express')
const router = new express.Router()
const { User, Client, Appointment, Doctor, Family} = require('../database')
const { middlewares, errors } = require('../utils')
const { urlencoded, request } = require('express')



router.post(
  '/appointments',
  express.json(),
  middlewares.requireHeaders({ accessToken: true, deviceId: true }),
  middlewares.requireVerification({ phone: true, email: true }),
  async (req,res)=>{
      //User authentication
      try{
          const user = await User.findById(req.params.userId)
          if (!user) {
            return res.status(404).send("Account not found")
          }

      // Validating the Date and time of appointment
      let time = req.body.time
      for(let i=0;i<time.length;i++){
        let index = time[i].indexOf(":")
        if(index===-1){
            return res.status(403).send("Invalid date and time")
        }
        let hour = time[i].slice(0,index)
        if(hour > 12 || hour === ""){
            return res.status(403).send("Invalid date and time")
        }
        let minute = time[i].slice(index+1,time[i].length)
        if(minute >= 60 || minute === ""){
            return res.status(403).send("Invalid date and time")
        }
        let date = new Date(req.body.date)
        date.setHours(hour,minute)
        if(date.getTime()!==date.getTime()){
            return res.status(403).send("Invalid date and time")
        }
      }

      //Validating whether the Slots are continous
      for(let i=0;i<time.length-1;i++){
        time_prev = parseInt(time[i].replace(":",""))
        time_next = parseInt(time[i+1].replace(":",""))
        if(time_prev+10!==time_next){
            return res.status(403).send("Selected slots are not continous or invalid")
        }
      }

      //Validating if the selected slots are available
       const doctor =  await Doctor.findById({_id:req.body.doctorid})
       if(!doctor){
          return res.status(403).send("Could not find doctor")
       }

       const date = new Date(req.body.date)
       const busySlots = doctor.busySlots
       let bool1 = false
       let index1
       for(let j=0;j<busySlots.length;j++){
           if(date.getTime()===busySlots[j].date.getTime()){
               bool1 = true
               index1 = j
               break
           }
       }
       

       let bool2 = false
       if(bool1===true & typeof index1 !== "undefined"){
            for(let k = 0;k<req.body.time.length;k++){
                bool2 = bool2 || busySlots[index1].time.includes(req.body.time[k])
            }
       }
       
       if(bool2===true){
           return res.status(403).send("Selected slots are booked already")
       }
    
      //Creating Apointment document
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


      //Updating the Busy Slots of the doctor
      // If the new appointment date is already present in the Busy slots of doctor,then we just add the new time to that date
      // Else we create new busy Slot with respect to new appointment and time
      let bool = false
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
      res.status(201).send(appointment)
}
catch(e){
  res.status(500).send(e)
}
})



router.patch(
    '/appointments/:id',
    express.json(),
    middlewares.requireHeaders({ accessToken: true, deviceId: true }),
    middlewares.requireVerification({ phone: true, email: true }),
    async(req,res)=>{
    try{ 

        // User authentication
        const user = await User.findById(req.params.userId)
        if (!user) {
          return res.status(404).send("Account not found")
        }
        
        const appointment = await Appointment.findById(req.params.id)
        if(!appointment){
            return res.status(404).send("Appointment could not be found")
        }

        // Validating date and time
        let time = req.body.time
        for(let i=0;i<time.length;i++){
            let index = time[i].indexOf(":")
            let hour = time[i].slice(0,index)
            if(hour>12 || hour === ""){
                return res.status(403).send("Invalid date and time")
            }
            let minute = time[i].slice(index+1,time[i].length)
            if(minute>=60 || minute === ""){
                return res.status(403).send("Invalid date and time")
            }
            let date = new Date(req.body.date)
            date.setHours(hour,minute)
            if(date.getTime()!==date.getTime()){
                return res.status(403).send("Invalid date and time")
            }
        }

        //Validating whether the Slots are continous
        for(let i=0;i<time.length-1;i++){
            time_prev = parseInt(time[i].replace(":",""))
            time_next = parseInt(time[i+1].replace(":",""))
            if(time_prev+10!==time_next){
                return res.status(403).send("Selected slots are not continous or invalid")
            }
        }
        

        // Rescheduling the appointment
        const dtime = appointment.time
        const ddate = appointment.date
        await appointment.updateOne({
            date : req.body.date,
            time : req.body.time
        },{new: true})
        await appointment.save()


        //Updating the Busy Slot of the corresponding doctor
        const doctor = await Doctor.findById(appointment.doctorId)
        let index
        for(let i=0;i<doctor.busySlots.length;i++){
            if(doctor.busySlots[i].date.getTime() === ddate.getTime()){   
                index = i
                break
            }   
        } 
        // 1) Removing the old appointment date and time from doctor's busy slot
        const array = doctor.busySlots[index].time.filter(tim => !dtime.includes(tim)) 
        doctor.busySlots[index].time = array
        if (doctor.busySlots[index].time.length===0){
            doctor.busySlots.splice(index,1)
        }

        // 2) Adding new appointment date and time to doctor's busy slot
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
    '/appointments/:id',
    express.json(),
    middlewares.requireHeaders({ accessToken: true, deviceId: true }),
    middlewares.requireVerification({ phone: true, email: true }),
    async(req,res)=>{
    try{
        // User authentication
        const user = await User.findById(req.params.userId)
        if (!user) {
          return res.status(404).send("Account not found")
        }

        const appointment = await Appointment.findOne({_id:req.params.id,isDeleted:false})
        if(!appointment){
           return res.status(404).send('Appointment could not be found')  
        }

        //Removing the appointment
        const doctor = await Doctor.findById(appointment.doctorId)
        await appointment.updateOne({isDeleted:true})
    
        // Updating the doctor's busy slots
        let index
        for(let i=0;i<doctor.busySlots.length;i++){
            if(doctor.busySlots[i].date.getTime() === appointment.date.getTime()){   
                index = i
                break
            }   
        }  
        const array = doctor.busySlots[index].time.filter(tim => !appointment.time.includes(tim))
        doctor.busySlots[index].time = array
        if (doctor.busySlots[index].time.length===0){
            doctor.busySlots.splice(index,1)
        }
        await doctor.save()
        res.status(200).send({
            doctorName:doctor.name,
            doctorEducation:doctor.qualification,
            appointmentDate:appointment.date,
            appointmentTime:appointment.time[0]

        })
    }     
    catch(e){
        res.status(500).send(e)
    }
})



router.get(
    '/appointments',
    express.json(),
    middlewares.requireHeaders({ accessToken: true, deviceId: true }),
    middlewares.requireVerification({ phone: true, email: true }),
    async (req,res)=>{
    try{
        //User authentication
        const user = await User.findById(req.params.userId)
        if (!user) {
            return res.status(404).send("Account not found")
        }

        // Removing expired appointments
        let appointments = await Appointment.find({userId:req.params.userId,isDeleted:false})
//         for(let i=0;i<appointments.length;i++){
//             // Since time is stored as String type, we need to convert that string to Valid datetime 
//             let index = appointments[i].time[0].indexOf(":")
//             let hour = appointments[i].time[0].slice(0,index)
//             let minute = appointments[i].time[0].slice(index+1,appointments[i].time[0].length)
//             let appointment_date = new Date(appointments[i].date)
//             appointment_date.setHours(hour,minute) 
//             if(appointment_date<new Date()){
//                 const doctor = await Doctor.findById(appointments[i].doctorId)
//                 await appointments[i].updateOne({isDeleted:true})
                
//                 //Updating busy slots of the doctor
    
//                 let index
//                 for(let j=0;j<doctor.busySlots.length;j++){
//                     if(doctor.busySlots[j].date.getTime() === appointments[i].date.getTime()){   
//                         index = j
//                         break
//                     }   
//                 }  
//                 if(index){
//                     const array = doctor.busySlots[index].time.filter(tim => !appointments[i].time.includes(tim))
//                     doctor.busySlots[index].time = array
//                     if(doctor.busySlots[index].time.length===0){
//                         doctor.busySlots.splice(index,1)
//                     }
//                     await doctor.save() 
//                 }
//             }
//         }
        appointments = await Appointment.find({userId:req.params.userId,isDeleted:false})
        if(appointments.length===0){
            return res.status(200).send("No appointments to show")
        }
        var array = []
        for(let i = 0;i<appointments.length;i++){
            let doctor = await Doctor.findById({_id:appointments[i].doctorId})
            if(!doctor){
              return res.status(404).send("Could not find doctor")
            }
            let obj = {
                date:appointments[i].date,
                time:appointments[i].time[0],
                doctorName:doctor.name,
                doctorEducation:doctor.qualification,
                appointmentid:appointments[i]._id
            }
            array = array.concat(obj)
        }
        res.status(200).send(array)
        }
    catch(e){
        res.status(500).send(e)
    }
})


router.get('/appointments/details',
    express.json(),
    middlewares.requireHeaders({ accessToken: true, deviceId: true }),
    middlewares.requireVerification({ phone: true, email: true }),
    async(req,res)=>{
        try{
          //User authentication
        const user = await User.findById(req.params.userId)
        if (!user) {
           return res.status(404).send("Account not found")
        }

        var familymembers = await Family.find({user:user._id})
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



router.post('/appointments/insurance',
    urlencoded({ extended: true }),  
    middlewares.requireHeaders({ accessToken: true, deviceId: true }),
    middlewares.requireVerification({ phone: true, email: true }),
    async(req,res)=>{
    try{
          //User authentication
        const user = await User.findById(req.params.userId)
        if (!user) {
            return res.status(404).send("Account not found")
        }

        if(req.body.insurance){
            user.insurance = user.insurance.concat(req.body.insurance)
            await user.save()
            return res.status(201).send("New insurance added successfully")
        }
        else{
            return res.status(403).send("New insurance cannot be added")
        }
    }

    catch(e){
            res.status(500).send(e)
    }
  })

 
module.exports = router
