const { Router, response, request } = require("express");
const Doctor = require("../database/Doctor");
const { route } = require("./User");
const multer  = require('multer')
const sharp = require('sharp')
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
router.get(
  '/accounts/:userid',
  middlewares.inflate({
    strict: true, token: true, userAgent: true, deviceId: true,
  }),
  async (request, response) => {
    try {
      // Get the client document
      const client = await Client.findOne({
        _id: request.params.deviceId,
        user: request.params.userid,
        token: request.params.token,
        userAgent: request.params.userAgent,
      });

      // Check if client belongs to user
      if (client.user.toString() !== request.params.userid) {
        response.status(403);
        throw new Error('Device isn\'t registered with user');
      }

      // Get the user
      const user = await User.findById(request.params.userid);

      // Send user data
      response.json(user);
    } catch (error) {
      console.error(error);
      response.send(error.message);
    }
  },
);

const upload = multer({
  limits:{
    fileSize:1000000,
  },
  fileFilter(request,file,cb)
  {
    if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) 
    return cb(new Error('pelase upload a jpeg or jpg or png'))

    cb(null,true)
  }
})


router.post(
  '/doctor/:id/avatar',upload.single('file'),
  async (request,response) => {
  const buffer = await sharp(request.file.buffer).png().toBuffer()
  const doctor = await Doctor.findById(request.params.id)
  doctor.avatar = buffer
  await doctor.save()
  response.send()
},(error,request,response,next) => {
  response.status(400).send({error})
})
module.exports=router