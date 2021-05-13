/* eslint-disable no-console */
const { Router, urlencoded } = require('express');
const { User, Client, Family } = require('../database');
const { middlewares } = require('../utils');

const router = Router();

/**
 * `http POST` request handler for family member creation.
 * * Requires `access-token `device-id` to be present
 */
/**
 * @swagger
 * components:
 *   schemas:
 *    Family:
 *     type: object
 *     required:
 *      - user
 *      - firstName
 *      - lastName
 *      - relationship
 *      - gender
 *      - dateOfBirth
 *      - bloodGroup
 *      - address
 *     properties:
 *      _id:
 *       type: ObjectID
 *       description: The auto-generated Id for family member
 *      user:
 *       type: ObjectID
 *       description: parent user id
 *      firstName:
 *       type: String
 *       description: first name of family member
 *      lastName:
 *       type: String
 *       description: last name of family member
 *      relationship:
 *       type: String
 *       description: relationship between family member and parent user
 *      gender:
 *       type: String
 *       description: gender of family member
 *      dateOfBirth:
 *       type: Date
 *       description: birth date of family member
 *      bloodGroup:
 *       type: String
 *       description: blood group of family member
 *      address:
 *       type: String
 *       description: address of family member
 *      insurance:
 *       type: String
 *       description: insurance of family member
 *      emergencyName:
 *       type: String
 *       description: emergency name for family member
 *      emergencyNumber:
 *       type: String
 *       description: emergency phone number for family member
 *     example:
 *      user: 
 *      firstName: raj
 *      lastName: shetty
 *      relationship: son
 *      gender: male
 *      dateOfBirth: 12-08-2016
 *      bloodGroup: O+ve
 *      address: billekahalli bangalore
 *      insurance: REWNIL0057445
 *      emergencyName: abhi
 *      emergencyNumber: 7353164950          
 */

/**
 * @swagger
 * tags:
 *  name: Family
 *  description: Family Member Managing API 
 */

/**
 * @swagger
 * /familymember:
 *  post:
 *   summary: adding family member
 *   tags: [Family]
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
 *       $ref: '#/components/schemas/Family'
 *   responses:
 *    201:
 *     description: family member was added successfully
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

      response.status(201).json(family);
    } catch (error) {
      console.error(error);
      response.send(error.message);
    }
  });

/**
 * `http GET` request handler to fetch all family members.
 * * Requires `access-token `device-id` to be present
 */
/**
 * @swagger
 * /familymember/all:
 *  get:
 *   summary: listing all family member for particular user
 *   tags: [Family]
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
 *     description: family member fetched successfully
 *    500:
 *     description: something server error
 *    401:
 *     description: unauthorized access-token
 *    403:
 *     description: Operation requires 'device-id'
 *    404:
 *     description: family member not found
 * 
 *    
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
      response.status(200).json(familymembers);
    } catch (error) {
      console.error(error);
      response.send(error.message);
    }
  });

/**
 * `http DELETE` request handler to delete a family member.
 * * Requires `access-token `device-id` to be present
 */

/**
 * @swagger
 * /familymember/{id}:
 *  delete:
 *   summary: deleting family member
 *   tags: [Family]
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
 *      description: family member id
 *   responses:
 *    200:
 *     description: family meember was deleted successfully
 *    500:
 *     description: something server error
 *    401:
 *     description: unauthorized access-token
 *    403:
 *     description: Operation requires 'device-id'
 *    404:
 *     description: family member not found  
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
 * `http GET` request handler to fetch particular family member by id.
 * * Requires `access-token `device-id` to be present
 */

/**
 * @swagger
 * /familymember/{id}:
 *  get:
 *   summary: fetching family member by id
 *   tags: [Family]
 *   parameters:
 *    - name: access-token
 *      in: header
 *      required: true
 *      type: String
 *    - name: device-id
 *      in: header
 *      required: true
 *      type: String
 *    - in: path
 *      name: id
 *      type: String
 *      required: true
 *      description: family id
 *   responses:
 *    200:
 *     description: family member fetched successfully
 *    500:
 *     description: something server error
 *    401:
 *     description: unauthorized access-token
 *    403:
 *     description: Operation requires 'device-id'
 *    404:
 *     description: family member not found
 */

  router.get('/familymember/:id',
  middlewares.requireHeaders({ accessToken: true, deviceId: true }),
  middlewares.requireVerification({ phone: true }),
  async (request, response) => {
    try {
      
      const familymember = await Family.findById({ _id: request.params.id, user: request.params.userId });

      if (!familymember) {
        response.status(404);
        throw new Error('family member not found');
      }
      response.json(familymember);
    } catch (error) {
      console.error(error);
      response.send(error.message);
    }
  });


/**
 * `http PATCH` request handler to edit/update a family member.
 * * Requires `access-token `device-id` to be present
 */
/**
 * @swagger
 * /familymember/{id}:
 *  patch:
 *   summary: updating family member details
 *   tags: [Family]
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
 *      description: doctor id
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/Family'  
 *   responses:
 *    200:
 *     description: Family Member details was updated successfully
 *    500:
 *     description: something server error
 *    401:
 *     description: unauthorized access-token
 *    403:
 *     description: Operation requires 'device-id'
 *    404:
 *     description: family member not found    
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

      response.json(family);
    } catch (error) {
      console.error(error);
      response.send(error.message);
    }
  });

module.exports = router;
