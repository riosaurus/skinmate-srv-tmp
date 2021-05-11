/* eslint-disable no-console */
const { Router, urlencoded } = require('express');
const { Service } = require('../database');
const { middlewares, errors } = require('../utils');

const router = new Router();

/**
 * @adminOnly
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
