/* eslint-disable no-console */
const { Router, urlencoded } = require('express');
const multer  = require('multer')
const { User, Client } = require('../database');
const { middlewares } = require('../utils');


const router = Router();

/**
 * `http POST` request handler for user creation
 */
router.post(
  '/accounts',
  urlencoded({ extended: true }),
  middlewares.inflate({ strict: true, userAgent: true }),
  async (request, response) => {
    try {
      // Check if user exists
      if (await User.exists({ email: request.body.email })) {
        response.status(409);
        throw new Error('Email already in use');
      }

      // Create a user document, extract and assign values to prevent injection attacks
      const user = new User({
        email: request.body.email,
        password: request.body.password,
        phone: request.body.phone,
        address: request.body.address,
        name: request.body.name,
      });

      // Validate the document before generating a client
      await user.validate()
        .catch((error) => {
          console.error(error);
          response.status(412);
          throw new Error(`Invalid details: ${error.message}`);
        });

      await user.save().catch((error) => {
        console.error(error);
        response.status(500);
        throw new Error(`Couldn't create user: ${error.message}`);
      });

      // On-register-direct-login approach
      const client = await Client.create({ user: user.id, userAgent: request.headers['user-agent'] })
        .catch((error) => {
          console.error(error);
          response.status(500);
          throw new Error('Couldn\'t add client');
        });

      response.status(201).json(client);
    } catch (error) {
      console.error(error);
      response.send(error.message);
    }
  },
);

/**
 * `http GET` request handler to fetch user
 */
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
    fileSize:1000000
  },
  fileFilter(req,file,cb)
  {
    if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) 
    return cb(new Error('pelase upload a jpeg or jpg or png'))

    cb(null,true)
  }
})


router.post('/accounts/:userid/avatar',upload.single('avatar'),async (request,response) => {

  const buffer = await sharp(req.file.buffer).png().toBuffer()
  const user = await User.findById(request.params.userid)
  user.avatar = buffer
  await user.save()

  response.send()


},(error,req,res,next) => {
  res.status(400).send({error:error.message})
})

/**
 * User router
 */
module.exports = router;
