const { Router, urlencoded } = require('express');
const { User, Client } = require('../database');

const router = Router();

/**
 *
 */
router.post(
  '/accounts',
  urlencoded({ extended: true }),
  async (request, response) => {
    try {
      // Check if valid user-agent
      if (!request.headers['user-agent']) {
        response.status(400);
        throw new Error('Unrecognized user-agent');
      }

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
      await user.validate();

      // On-register-direct-login approach
      const client = await Client.addDevice(user, request.headers['user-agent']);

      // Assign client access to the user
      user.linkClient().addDevice(request.headers['user-agent'])
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error);
          response.status(500);
          throw new Error('User created; Failed to register device');
        });

      await user.save().catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error);
        response.status(500);
        throw new Error(`Couldn't create user: ${error.message}`);
      });

      response.status(201).json(client.toJSON({ useProjection: true }));
    } catch (error) {
      response.send(error.message);
    }
  },
);

/**
 * User router
 */
module.exports = router;
