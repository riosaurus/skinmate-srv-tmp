/* eslint-disable no-console */
const { Router, urlencoded } = require('express');
const { User, Client } = require('../database');
const { middlewares } = require('../utils');

const router = Router();

/**
 * `http POST` request handler for user creation
 */
router.post(
  '/accounts',
  urlencoded({ extended: true }),
  middlewares.clientParser(true, false, false),
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
          throw error;
        });

      await user.save().catch((error) => {
        console.error(error);
        response.status(500);
        throw new Error(`Couldn't create user: ${error.message}`);
      });

      // On-register-direct-login approach
      const client = await Client.create({ user: user.id, userAgent: request.params.userAgent })
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
 * `http POST` request handler for user authentication
 */
router.post(
  '/accounts/signin',
  urlencoded({ extended: true }),
  middlewares.clientParser(true, false, false),
  async (request, response) => {
    try {
      // Get the user document
      const user = await User.findByEmail(request.body.email)
        .catch((error) => {
          console.error(error);
          response.status(500);
          throw error;
        });

      // Check if user exists
      if (!user) {
        response.status(404);
        throw new Error('User not found');
      }

      // Compare password
      const isPasswordMatch = await user.isPasswordMatch(request.body.password)
        .catch((error) => {
          response.status(500);
          throw error;
        });

      if (!isPasswordMatch) {
        response.status(401);
        throw new Error('Passwords don\'t match');
      }

      let client = await Client.findOne({ _id: request.params.deviceId });

      // Check if token exists for this device, remove it
      if (client) {
        client = await client.save();
      } else {
        client = await Client.create({ user: user.id, userAgent: request.params.userAgent })
          .catch((error) => {
            console.error(error);
            response.status(500);
            throw new Error('Couldn\'t add client');
          });
      }

      // Activate client if deactivated
      if (user.isDeleted) {
        await user.update({ isDeleted: false });
        await user.save();
      }

      response.json(client);
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
  '/accounts',
  middlewares.clientParser(true, true),
  async (request, response) => {
    try {
      // Get the user
      const user = await User.findById(request.params.userId);
      // Remove password field
      const { password, ...rest } = user.toJSON();
      // Send user data
      response.json(rest);
    } catch (error) {
      console.error(error);
      response.send(error.message);
    }
  },
);

/**
 * `http DELETE` request handler to delete user
 */
router.delete(
  '/accounts',
  middlewares.clientParser(true, true),
  async (request, response) => {
    try {
      // Get the user
      const user = await User.findById(request.params.userId);

      // Clear all client documents for this user
      await Client.deleteMany({ user: user.id });

      // Soft delete the user
      await user.update({ isDeleted: true });

      // Save
      await user.save();

      response.send();
    } catch (error) {
      console.error(error);
      response.send(error.message);
    }
  },
);

/**
 * User router
 */
module.exports = router;
