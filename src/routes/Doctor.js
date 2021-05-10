const { Router} = require("express");
const Doctor = require("../database/Doctor");
const multer  = require('multer')
const sharp = require('sharp')
const router=Router()
const {middlewares} =require('../utils')

/** 
 * creating doctor
* @param {Object} *request body
* @returns {document}  *Document
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

/**
 * get all doctor details 
 * @param {none} *no parameter needed
 * @returns {Array} *array of doctors information
 * @default [] *empty array
 */
router.get(
  '/doctor/all/list',
  middlewares.requireHeaders({ accessToken: true, deviceId: true }),
  middlewares.requireVerification({ phone: true }),
  async(request,response)=>{
   try {
    let doctor=await Doctor.find()
    if(doctor){
     response.status(200).send(doctor)
    }
    else{
    response.status(404).send({message:"documents not found"})
    }
   } catch (error) {
    response.status(500).send(error)
   }
  }
)
//find doctor by Id
/**
 * @param {String} id
 * @returns {Promise<Document|null>} *if doctor exist returns document otherwise null
 */

router.get(
  '/doctor/:id',
  middlewares.requireHeaders({ accessToken: true, deviceId: true }),
  middlewares.requireVerification({ phone: true }),
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

/**
 * updating doctor information
 * @param {String} id
 * @returns {Promise<Document|null>} *if doctor exist returns document otherwise null 
 */
router.patch(
  '/doctor/update/:id',
  async(request,response)=>{
     try {
      const updates=Object.keys(request.body)
      const allowed_flieds=['name','email','qualification','phone']
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


/**
 * deleting doctor document
 * @param {String} id
 * @returns {Promise<Document|null>} *if doctor exist returns document otherwise null 
 */
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

//setup for profile picture uploding for doctor collection

const upload = multer({
  limits:{
    fileSize:3000000,
  },
  fileFilter(request,file,cb)
  {
    if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) 
    return cb(new Error('pelase upload a jpeg or jpg or png'))

    cb(null,true)
  }
})

/**
 * uploading profile picture for doctor 
 * @param {file} file *image file
 * @param {id} id  *doctor id 
 */

router.post(
  '/doctor/:id/avatar',upload.single('file'),
  async (request,response) => {
  const buffer = await sharp(request.file.buffer).png().toBuffer()
  const doctor = await Doctor.findById(request.params.id)
  doctor.avatar = buffer
  await doctor.save()
  response.send()
},(error,request,response,next) => {
  console.log(error)
  response.status(400).send({error})
})


module.exports=router