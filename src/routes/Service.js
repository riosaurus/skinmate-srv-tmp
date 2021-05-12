/* eslint-disable no-console */
const { Router, urlencoded } = require('express');
const { Service } = require('../database');
const { middlewares, errors } = require('../utils');

const router = new Router();
/**
 * @swagger
 * components:
 *   schemas:
 *    Services:
 *     type: object
 *     required:
 *      - name
 *     properties:
 *      _id:
 *       type: ObjectdID
 *       description: The auto-generated Id for services
 *      name:
 *       type: String
 *       description: name of the service
 *      description:
 *       type: String
 *       description: description of service
 *      staff:
 *       type: Array
 *       description: collection of doctor id who is part of service
 *      sub:
 *       type: Array
 *       description: collection of sub services       
 *     example:
 *      name: Medical
 *      description: medical service having doctor appoiment feature  
 */
/**
 * @swagger
 * tags:
 *  name: Service
 *  description: Service Managing API 
 */

/**
 * @adminOnly
 */
/**
 * @swagger
 * /services:
 *  post:
 *   summary: creating service
 *   tags: [Service]
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
 *       $ref: '#/components/schemas/Services'
 *   responses:
 *    201:
 *     description: Service was created successfully
 *    500:
 *     description: something server error
 *    401:
 *     description: unauthorized access-token
 *    403:
 *     description: Operation requires 'device-id'
 *    406:
 *     description: validation Error    
 */
router.post(
  '/services',
  urlencoded({ extended: true }),
  middlewares.requireHeaders({ accessToken: true, deviceId: true }),
  middlewares.requireVerification({ admin: true }),
  async (request, response) => {
    try {
      // Create service document
      const service = await Service.create({
        name: request.body.name,
        description: request.body.description,
        staff: request.body.staff,
      }).catch((error) => {
        console.error(error);
        response.status(errors.SAVE_SERVICE_FAILED.code);
        throw errors.SAVE_SERVICE_FAILED.error;
      });

      response.status(201).json(service);
    } catch (error) {
      response.send(error);
    }
  },
);

/**
 * @public
 */
/**
 * @swagger
 * /services:
 *  get:
 *   summary: listing all services
 *   tags: [Service]
 *   responses:
 *    200:
 *     description: service list sent successfully
 *    500:
 *     description: something server error 
 */
router.get(
  '/services',
  async (_request, response) => {
    try {
      // Retrieve all services
      const services = await Service.find()
        .catch((error) => {
          console.error(error);
          response.status(errors.FIND_SERVICE_FAILED.code);
          throw errors.FIND_SERVICE_FAILED.error;
        });

      // Populate refs
      const populatedServices = await Promise.all(services.map(
        (service) => service.populate({
          path: 'staff',
          select: 'name email phone qualification',
        }).execPopulate(),
      ));

      response.json(populatedServices);
    } catch (error) {
      response.send(error.message);
    }
  },
);

/**
 * @public
 */

/**
 * @swagger
 * /services/{id}:
 *  get:
 *   summary: fetching service by id
 *   tags: [Service]
 *   parameters:
 *    - in: path
 *      name: id
 *      type: String
 *      required: true
 *      description: service id
 *   responses:
 *    200:
 *     description: successfully fetched service deatails by id
 *    500:
 *     description: could not found doctor 
 */
router.get(
  '/services/:id',
  async (request, response) => {
    try {
      // Fetch the service
      const service = await Service.findOne({
        _id: request.params.id,
      }).catch((error) => {
        console.error(error);
        response.status(errors.FIND_SERVICE_FAILED.code);
        throw errors.FIND_SERVICE_FAILED.error;
      });

      if (!service) {
        response.status(errors.NULL_SERVICE.code);
        throw errors.NULL_SERVICE.error;
      }

      // Populate refs
      const populatedService = await service.populate({
        path: 'staff',
        select: 'name email phone qualification',
      }).execPopulate();

      response.json(populatedService);
    } catch (error) {
      response.send(error);
    }
  },
);

/**
 * `http PATCH` request handler for updating a service.
 */
/**
 * @swagger
 * /services/{id}:
 *  patch:
 *   summary: updating service
 *   tags: [Service]
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
 *      description: service id
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/Services'  
 *   responses:
 *    200:
 *     description: service was updated successfully
 *    500:
 *     description: something server error
 *    401:
 *     description: unauthorized access-token
 *    403:
 *     description: Operation requires 'device-id'
 *    
 */

router.patch(
  '/services/:id',
  urlencoded({ extended: true }),
  middlewares.requireHeaders({ accessToken: true, deviceId: true }),
  middlewares.requireVerification({ admin: true, phone: true, email: true }),
  async (request, response) => {
    try {
      // Get the service document
      const service = await Service.findOne({
        _id: request.params.id,
      }).catch((error) => {
        console.error(error);
        response.status(errors.FIND_SERVICE_FAILED.code);
        throw errors.FIND_SERVICE_FAILED.error;
      });

      if (!service) {
        response.status(errors.NULL_SERVICE.code);
        throw errors.NULL_SERVICE.error;
      }

      const updates = Object.keys(request.body);
      const allowedUpdates = ['name', 'description', 'staff', 'sub'];
      const isvalidoperation = updates.every((update) => allowedUpdates.includes(update));

      if (!isvalidoperation) {
        const { code, error } = errors.FORBIDDEN_UPDATE_ERROR(updates
          .filter((key) => !allowedUpdates.includes(key)));
        response.status(code);
        throw error;
      }

      updates.forEach((update) => {
        service[update] = request.body[update];
      });

      const updatedService = await service.save().catch((error) => {
        console.error(error);
        response.status(errors.UPDATE_SERVICE_FAILED.code);
        throw errors.UPDATE_SERVICE_FAILED.error;
      });

      response.json(updatedService);
    } catch (error) {
      response.send(error);
    }
  },
);

/**
 * `http DELETE` request handler for fetching a service.
 * * Requires `user-agent` to be present
 */
/**
 * @swagger
 * /services/{id}:
 *  delete:
 *   summary: deleting service
 *   tags: [Service]
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
 *      description: service id
 *   responses:
 *    200:
 *     description: service was deleted successfully
 *    500:
 *     description: something server error
 *    401:
 *     description: unauthorized access-token
 *    403:
 *     description: Operation requires 'device-id'
 *    
 */

router.delete(
  '/services/:id',
  middlewares.requireHeaders({ accessToken: true, deviceId: true }),
  middlewares.requireVerification({ admin: true }),
  async (request, response) => {
    try {
      // Check for service
      if (!(await Service.exists({ _id: request.params.id }))) {
        response.status(errors.NULL_SERVICE.code);
        throw errors.NULL_SERVICE.error;
      }

      // Delete right away
      await Service.deleteOne({
        _id: request.params.id,
      }).catch((error) => {
        console.error(error);
        response.status(errors.DELETE_SERVICE_FAILED.code);
        throw errors.DELETE_SERVICE_FAILED.error;
      });

      response.send('Service deleted');
    } catch (error) {
      response.send(error);
    }
  },
);

module.exports = router;
