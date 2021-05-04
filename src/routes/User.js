/* eslint-disable no-console */
const { compare } = require('bcryptjs');
const { Router, urlencoded } = require('express');
const multer = require('multer');
const sharp = require('sharp');
const { User, Client } = require('../database');
const TOTP = require('../database/TOTP');
const { middlewares } = require('../utils');
const { sendCode, verifyCode } = require('../utils/otp-server');
const {sendEmailForVerification,verifyEmail}= require('../utils/EmailVerification')
const path=require('path');
const router = Router();
/**
 * `http POST` request handler for user creation.
 * * Requires `user-agent` to be present
 */
router.post(
  '/accounts',
  urlencoded({ extended: true }),
  middlewares.requireHeaders({ userAgent: true }),
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
      sendEmailForVerification(user.email,user._id)
      response.status(201).json(client);
    } catch (error) {
      console.error(error);
      response.send(error.message);
    }
  },
);

/**
 * `http GET` request handler to fetch user
 * * Requires `access-token` `device-id` `user-agent`
 */
router.get(
  '/accounts',
  middlewares.requireHeaders({ accessToken: true, deviceId: true }),
  middlewares.requireVerification({ phone: true, email: true }),
  async (request, response) => {
    try {
      // Get the client document
      const client = await Client.findOne({
        _id: request.headers['device-id'],
        token: request.headers['access-token'],
      });

      if (!client) {
        response.status(403);
        throw new Error('Unrecognized device');
      }

      // Get the user
      const user = await User.findOne({ _id: client.user, isDeleted: { $ne: true } });

      if (!user) {
        response.status(404);
        throw new Error('Account not found');
      }

      const { password, isDeleted, ...rest } = user.toJSON();

      response.json(rest);
    } catch (error) {
      console.error(error);
      response.send(error.message);
    }
  },
);

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(request, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) return cb(new Error('pelase upload a jpeg or jpg or png'));
    cb(null, true);
    return null;
  },
});

/**
 * `http POST` request handler to upload user profile avatar
 * * Requires `access-token` `device-id` `user-agent`
 */
router.post(
  '/accounts/avatar',
  middlewares.requireHeaders({ accessToken: true, deviceId: true }),
  middlewares.requireVerification({ phone: true, email: true }),
  upload.single('file'),
  async (request, response) => {
    try {
      // Get the client document
      const client = await Client.findOne({
        _id: request.headers['device-id'],
        token: request.headers['access-token'],
      });

      if (!client) {
        response.status(403);
        throw new Error('Unrecognized device');
      }

      const buffer = await sharp(request.file.buffer).png().toBuffer();

      const user = await User.findById(client.user);

      if (!user) {
        response.status(404);
        throw new Error('Account not found');
      }

      user.avatar = buffer;

      await user.save();

      response.send('avatar uploaded');
    } catch (error) {
      console.error(error);
      response.send(error.message);
    }
  },
);

/**
 * `http PATCH` request handler to edit user profile
 * * Requires `access-token` `device-id`
 */

router.patch(
  '/accounts',
  urlencoded({ extended: true }),
  middlewares.requireHeaders({ accessToken: true, deviceId: true }),
  middlewares.requireVerification({ phone: true, email: true }),
  async (request, response) => {
    try {
      // Get the client document
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

      const updates = Object.keys(request.body);
      const allowupdates = ['firstName', 'lastName', 'gender', 'dateOfBirth', 'bloodGroup', 'address', 'insurance', 'emergencyName', 'emergencyNumber'];
      const isvalidoperation = updates.every((update) => allowupdates.includes(update));

      if (!isvalidoperation) {
        response.status(500);
        throw new Error('invalid property');
      }

      updates.forEach((update) => {
        user[update] = request.body[update];
      });

      await user.save();

      const {
        password, isDeleted, avatar, ...rest
      } = user.toJSON();

      response.send(rest);
    } catch (error) {
      console.log(error);
      response.send(error.message);
    }
  },
);

/**
 * `http DELETE` request handler to delete user
 * * Requires `access-token` `device-id`
 */
router.delete(
  '/accounts',
  middlewares.requireHeaders({ accessToken: true, deviceId: true }),
  async (request, response) => {
    try {
      // Get the client document
      const client = await Client.findOne({
        _id: request.headers['device-id'],
        token: request.headers['access-token'],
      }).catch((error) => {
        console.error(error);
        response.status(500);
        throw new Error('Couldn\'t validate access');
      });

      if (!client) {
        response.status(403);
        throw new Error('Unrecognized device');
      }

      // Get the user
      const user = await User.findOne({
        _id: client.user,
        isDeleted: { $ne: true },
      }).catch((error) => {
        console.error(error);
        response.status(500);
        throw new Error('Couldn\'t find user');
      });

      if (!user) {
        response.status(404);
        throw new Error('Account not found');
      }

      await user.update({ isDeleted: true })
        .catch((error) => {
          console.error(error);
          response.status(500);
          throw new Error('Couldn\'t delete user');
        });

      response.send('Account deleted');
    } catch (error) {
      response.send(error.message);
    }
  },
);

/**
 * `http POST` request handler for user authentication (signin).
 * * Requires `user-agent` to be present
 * * Optional `device-id`
 */
router.post(
  '/accounts/auth',
  urlencoded({ extended: true }),
  middlewares.requireHeaders({ userAgent: true }),
  async (request, response) => {
    try {
      // Get the user
      const user = await User.findOne({
        email: request.body.email,
        isDeleted: { $ne: true },
      });

      if (!user) {
        response.status(404);
        throw new Error('Account not found');
      }

      // Check password
      const isPasswordValid = await compare(request.body.password, user.password)
        .catch((error) => {
          console.error(error);
          response.status(500);
          throw new Error('Couldn\'t verify password');
        });

      if (!isPasswordValid) {
        response.status(401);
        throw new Error('Incorrect password');
      }

      let client = await Client.findOne({ _id: request.headers['device-id'] })
        .catch((error) => {
          console.error(error);
          // Safe skip
        });

      if (client) {
        client = await client.save();
      } else {
        client = await Client.create({ user: user.id, userAgent: request.headers['user-agent'] })
          .catch((error) => {
            console.error(error);
            response.status(500);
            throw new Error('Couldn\'t authenticate');
          });
      }

      response.json(client);
    } catch (error) {
      response.send(error.message);
    }
  },
);

/**
 * `http PURGE` request handler for user authentication (signout).
 * * Requires `access-token` `device-id` to be present
 */
router.purge(
  '/accounts/auth',
  middlewares.requireHeaders({ accessToken: true, deviceId: true }),
  async (request, response) => {
    try {
      await Client.deleteOne({
        _id: request.headers['device-id'],
        token: request.headers['access-token'],
      })
        .catch((error) => {
          console.error(error);
          response.status(500);
          throw new Error('Couldn\'t sign you out');
        });

      response.send('You\'re signed out');
    } catch (error) {
      response.send(error.message);
    }
  },
);

/**
 * `http GET` request handler for user phone verification.
 * * Requires `access-token` `device-id` to be present
 */
router.get(
  '/accounts/verify',
  middlewares.requireHeaders({ accessToken: true, deviceId: true }),
  async (request, response) => {
    try {
      // Get client to identify user
      const client = await Client.findOne({
        _id: request.headers['device-id'],
        token: request.headers['access-token'],
      })
        .catch((error) => {
          console.error(error);
          response.status(500);
          throw new Error('Couldn\'t sign in');
        });

      // Get the user
      const user = await User.findById(client.user.toString())
        .catch((error) => {
          console.error(error);
          response.status(404);
          throw new Error('Couldn\'t find user');
        });

      // Generate a TOTP document
      const totp = await TOTP.create({ user: user.id })
        .catch((error) => {
          console.error(error);
          response.status(500);
          throw new Error('Couldn\'t register OTP');
        });

      // Send OTP to user.phone
      await sendCode(user.phone, totp.secret)
        .catch((error) => {
          console.error(error);
          response.status(500);
          throw new Error('Couldn\'t send OTP');
        });

      const { secret, ...rest } = totp.toJSON();

      // Send secret to user
      response.json(rest);
    } catch (error) {
      console.error(error);
      response.send(error.message);
    }
  },
);

/**
 * `http POST` request handler for user phone verification.
 * * Requires `access-token` `device-id` to be present in the headers.
 * * Requires `requestId` `code` to be sent in the body.
 */
router.post(
  '/accounts/verify',
  urlencoded({ extended: true }),
  middlewares.requireHeaders({ accessToken: true, deviceId: true }),
  async (request, response) => {
    try {
      // Get client to identify user
      const client = await Client.findOne({
        _id: request.headers['device-id'],
        token: request.headers['access-token'],
      })
        .catch((error) => {
          console.error(error);
          response.status(500);
          throw new Error('Couldn\'t sign you out');
        });

      // Get the user
      const user = await User.findById(client.user.toString())
        .catch((error) => {
          console.error(error);
          response.status(404);
          throw new Error('Couldn\'t find user');
        });

      // Get the TOTP document
      const totp = await TOTP.findOne({ _id: request.body.requestId, user: user.id })
        .catch((error) => {
          console.error(error);
          response.status(500);
          throw new Error('Couldn\'t register OTP');
        });

      // Verify OTP
      if (!verifyCode(totp.secret, request.body.code)) {
        response.status(401);
        throw new Error('Incorrect OTP');
      }

      user.verifiedPhone = true;
      await user.save();

      // Acknowledge on success
      response.send(`${user.phone} is now verified`);
    } catch (error) {
      console.error(error);
      response.send(error.message);
    }
  },
);


router.get(
  '/emailverification/:id',
  async(request,response)=>{
    try {
      const user=await User.findById(request.params.id)
      
      if(user){
        user.verifiedEmail=true
        await user.save()
        response.sendFile(path.join(__dirname,"../public/Templetes/email-200.html"))
      }
      else{
        response.sendFile(path.join(__dirname,"../public/Templetes/email-500.html"))
      }
    } catch (error) {
      response.sendFile(path.join(__dirname,"../public/Templetes/email-500.html"))
    }
  }
)
/**
 * User router
 */
module.exports = router;
