const { Router, response, request } = require("express");
const Doctor = require("../database/Doctor");
const { route } = require("./User");

const router=Router()

//doctor creation
/** 
* @param {Object} *Body Object 
* @returns {Promise<Document | null>} *Document
*/ 
router.post(
  '/doctor/create',
  async(request,response)=>{
     try{
      let doctor=Doctor({
        name:request.body.name,
        email:request.body.email,
        phone:request.body.phone,
        qualification:request.body.qualification
        })
      await doctor.save()
      response.status(201).send(doctor)
      } 
      catch(error){
        response.status(500).send(error)
       }
     }
)

//find doctor by Id
/**
 * @param {String} doctor_id
 * @returns {Promise<Document | null>} *if doctor exist returns document otherwise null
 */

router.get(
  '/doctor/:id',
  async(request,response)=>{
    try {
      let document=await Doctor.findById(request.params.id)
      if(document){
        response.status(200).send(document)
      }
      else{
        response.status(404).send("no document found")
      }
    } catch (error) {
      console.log(error)
      response.status(500).send(error)
    }
  }
)

//list all doctors
/**
 * @param {void}
 * @returns {document}
 */

router.get(
  '/doctor/all',
  async(request,response)=>{
    let doctor=await Doctor.find({})
    if(doctor){
       response.status(200).send(doctor)
    }
    else{
      response.status(404).send({message:"no doctor found"})
    }
  }
)
router.patch(
  '/doctor/update/:id',
  async(request,response)=>{
     try {
      const updates=Object.keys(request.body)
      const allowed_flieds=['name','email','qualification']
      let doctor=await Doctor.findById(request.params.id)
      updates.forEach(update=>{
        if(allowed_flieds.includes(update)){
          doctor[update]=request.body[update]
        }
      })
      await doctor.save()
      response.status(200).send(doctor)
     } catch (error) {
       response.status(500).send(error)
     } 
  }
)

router.delete(
  '/doctor/delete/:id',
  async(request,response)=>{
     try {
       let doctor=await Doctor.findById(request.params.id)
       if(doctor){
        await doctor.remove()
        response.status(200).send(doctor)
       }
       else{
         response.status(404).send("Not found")
       }
       
     } catch (error) {
       response.status(500).send(error)
     }
  }
)
 
module.exports=router