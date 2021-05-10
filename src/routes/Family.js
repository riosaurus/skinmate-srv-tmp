/* eslint-disable no-console */
const { Router, urlencoded } = require('express');
const { User, Client, Family } = require('../database');
const { middlewares } = require('../utils');

const router = Router();

/**
 * `http POST` request handler for family member creation.
 * * Requires `access-token `device-id` to be present
 */
router.post(
  '/familymember',
  urlencoded({ extended: true }),
  middlewares.requireHeaders({ accessToken: true, deviceId: true }),
  middlewares.requireVerification({ phone: true, email: true }),
  async (request, response) => {
    try {
    
      
      const family = new Family({
        user: request.params.userId,
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        relationship: request.body.relationship,
        gender: request.body.gender,
        dateOfBirth: request.body.dateOfBirth,
        bloodGroup: request.body.bloodGroup,
        address: request.body.address,
        insurance: request.body.insurance,
        emergencyName: request.body.emergencyName,
        emergencyNumber: request.body.emergencyNumber,

      });

      await family.save();

      response.status(201).send(family);
    } catch (error) {
      console.error(error);
      response.send(error.message);
    }
  });

/**
 * `http GET` request handler to fetch all family members.
 * * Requires `access-token `device-id` to be present
 */

router.get('/familymember/all',
  middlewares.requireHeaders({ accessToken: true, deviceId: true }),
  middlewares.requireVerification({ phone: true }),
  async (request, response) => {
    try {
     
      const familymembers = await Family.find({ user: request.params.userId });

      if (!familymembers) {
        response.status(404);
        throw new Error('family members not found');
      }
      response.status(200).send(familymembers);
    } catch (error) {
      console.error(error);
      response.send(error.message);
    }
  });

/**
 * `http DELETE` request handler to delete a family member.
 * * Requires `access-token `device-id` to be present
 */
router.delete('/familymember/:id',
  middlewares.requireHeaders({ accessToken: true, deviceId: true }),
  middlewares.requireVerification({ phone: true }),
  async (request, response) => {
    try {
      
      const familymember = await Family.findOneAndDelete({ _id: request.params.id, user: request.params.userId });

      if (!familymember) {
        response.status(404);
        throw new Error('family member not found');
      }
      response.send('family member deleted');
    } catch (error) {
      console.error(error);
      response.send(error.message);
    }
  });

/**
 * `http PATCH` request handler to edit/update a family member.
 * * Requires `access-token `device-id` to be present
 */
router.patch('/familymember/:id',
  urlencoded({ extended: true }),
  middlewares.requireHeaders({ accessToken: true, deviceId: true }),
  middlewares.requireVerification({ phone: true }),
  async (request, response) => {
    try {
    
      const family = await Family.findOne({ _id: request.params.id, user: request.params.userId })
        .catch((error) => {
          console.error(error);
          response.status(500);
          throw new Error('Couldn\'t find family member');
        });

      if (!family) {
        response.status(404);
        throw new Error('family member not found');
      }

      const updates = Object.keys(request.body);
      const allowupdates = ['firstName', 'lastName', 'relationship', 'gender', 'dateOfBirth', 'bloodGroup', 'address', 'insurance', 'emergencyName', 'emergencyNumber'];
      const isvalidoperation = updates.every((update) => allowupdates.includes(update));

      if (!isvalidoperation) {
        response.status(500);
        throw new Error('invalid property');
      }

      updates.forEach((update) => family[update] = request.body[update]);

      await family.save();

      response.send(family);
    } catch (error) {
      console.error(error);
      response.send(error.message);
    }
  });

module.exports = router;
