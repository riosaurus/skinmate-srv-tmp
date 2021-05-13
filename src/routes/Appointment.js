const express = require('express')
const router = new express.Router()
const { User, Client,Appointment,Doctor,Family} = require('../database')
//const User = require('../database/User')
//const Doctor = require('../database/Doctor')
//const Appointment = require('../database/Appointment')

const { middlewares, errors } = require('../utils')
const { urlencoded, request } = require('express')


/**
 * @swagger
 * components:
 *   schemas:
 *    Appointment:
 *     type: object
 *     required:
 *      - doctorId
 *      - date
 *      - time
 *      - paymentType
 *      - appointmentFor
 *     properties:
 *      _id:
 *       type: ObjectdID
 *       description: The auto-generated Id for doctor
 *      doctorId:
 *       type: ObjectID
 *       description: The auto-generated Id of the appointment doctor
 *      userId:
 *       type: ObjectID
 *       description: The auto-generated Id of the appointment owner
 *      date:
 *       type: Date
 *       description: Date of the appointment
 *      time:
 *       type: An array of String
 *       description: Time of the appointment
 *      paymentType:
 *       type: String
 *       description: payment type of the appointment bill
 *      insuranceInfo:
 *       type: String
 *       description: insurance information
 *      appointmentFor:
 *       type: String
 *       description: Name of the person for whom the appointment is booked
 *     example:
 *      doctorid: 609a2bda4b2b7600154d3c49
 *      date: 2021-06-01
 *      time: ["6:00","6:15"]
 *      paymentType: Insurance
 *      insuranceInfo: insurance1
 *      appointmentFor: Trishul
 */
/**
 * @swagger
 * tags:
 *  name: Appointment
 *  description: Appointments Managing API 
 */

/**
 * @swagger
 * /appointments:
 *  post:
 *   summary: creating new appointment
 *   tags: [Appointment]
 *   parameters:
 *    - name: access-token
 *      in: header
 *      required: true
 *      type: String
 *    - name: device-id
 *      in: header
 *      required: true
 *      type: String
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/Appointment'
 *   responses:
 *    201:
 *     description: Appointment was created successfully
 *    500:
 *     description: something server error
 *    401:
 *     description: unauthorized access-token
 *    403:
 *     description: Operation requires 'device-id'
 *    406:
 *     description: validation Error
 * 
 *    
 */


router.post(
  '/appointments',
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
      res.status(201).send(appointment)
}
catch(e){
  res.status(500).send(e)
}
})


/**
 * @swagger
 * /appointment/reschedule/{id}:
 *  patch:
 *   summary: rescheduling an existing appointment
 *   tags: [Appointment]
 *   parameters:
 *    - name: access-token
 *      in: header
 *      required: true
 *      type: String
 *    - name: device-id
 *      in: header
 *      required: true
 *      type: String
 *    - name: id
 *      in: path
 *      required: true
 *      type: String
 *      description: appointment id
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/Appointment'  
 *   responses:
 *    200:
 *     description: Appointment rescheduled successfully
 *    500:
 *     description: something server error
 *    401:
 *     description: unauthorized access-token
 *    403:
 *     description: Operation requires 'device-id'
 *    
 */



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



/**
 * @swagger
 * /appointment/cancel/{id}:
 *  delete:
 *   summary: cancelling an existing appointment
 *   tags: [Appointment]
 *   parameters:
 *    - name: access-token
 *      in: header
 *      required: true
 *      type: String
 *    - name: device-id
 *      in: header
 *      required: true
 *      type: String
 *    - name: id
 *      in: path
 *      required: true
 *      type: String
 *      description: appointment id  
 *   responses:
 *    200:
 *     description: Appointment cancelled successfully
 *    500:
 *     description: something server error
 *    401:
 *     description: unauthorized access-token
 *    403:
 *     description: Operation requires 'device-id'
 *    
 */


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


/**
 * @swagger
 * /appointments:
 *  get:
 *   summary: listing user appointments
 *   tags: [Appointment]
 *   parameters:
 *    - name: access-token
 *      in: header
 *      required: true
 *      type: String
 *    - name: device-id
 *      in: header
 *      required: true
 *      type: String
 *   responses:
 *    200:
 *     description: Appointment list sent successfully
 *    500:
 *     description: something server error
 *    401:
 *     description: unauthorized access-token
 *    403:
 *     description: Operation requires 'device-id'
 *    406:
 *     description: validation Error
 * 
 *    
 */


router.get(
    '/appointments',
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
            if(!doctor){
              res.status(404).send("Could not find the doctor")
            }
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



/**
 * @swagger
 * /appointment/details:
 *  get:
 *   summary: listing family members details and insurance list
 *   tags: [Appointment]
 *   parameters:
 *    - name: access-token
 *      in: header
 *      required: true
 *      type: String
 *    - name: device-id
 *      in: header
 *      required: true
 *      type: String
 *   responses:
 *    200:
 *     description: Family details and insurance list sent successfully
 *    500:
 *     description: something server error
 *    401:
 *     description: unauthorized access-token
 *    403:
 *     description: Operation requires 'device-id'
 *    406:
 *     description: validation Error
 * 
 *    
 */


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


/**
 * @swagger
 * /appointment/insurance:
 *  post:
 *   summary: Creating new insurance
 *   tags: [Appointment]
 *   parameters:
 *    - name: access-token
 *      in: header
 *      required: true
 *      type: String
 *    - name: device-id
 *      in: header
 *      required: true
 *      type: String
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/Appointment'
 *   responses:
 *    201:
 *     description: New insurance created successfully
 *    500:
 *     description: something server error
 *    401:
 *     description: unauthorized access-token
 *    403:
 *     description: Operation requires 'device-id'
 *    406:
 *     description: validation Error
 * 
 *    
 */

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
          if(req.body.insurance){
            user.insurance = user.insurance.concat(req.body.insurance)
            await user.save()
            res.status(201).send("New insurance added successfully")
          }
          else{
            res.status(403).send("New insurance cannot be added")
          }
        }

          catch(e){
            res.status(500).send(e)
          }
  })


module.exports = router







