/* eslint-disable no-console */
const { Router, urlencoded } = require('express');
const { readFileSync, existsSync } = require('fs');
const multer = require('multer');
const { middlewares, errors } = require('../utils');
const { Doctor } = require('../database');

const router = Router();

router.post('/doctors',
  urlencoded({ extended: true }),
  middlewares.requireHeaders({ accessToken: true, deviceId: true }),
  middlewares.requireVerification({ admin: true }),
  middlewares.requireBody(),
  async (request, response) => {
    try {
      // Create a doctor document
      const doctor = new Doctor({
        name: request.body.name,
        email: request.body.email,
        phone: request.body.phone,
        qualification: request.body.qualification,
      });

      // Validate for custom error handling
      await doctor.validate().catch((error) => {
        console.error(error);
        const validationError = errors.VALIDATION_ERROR(error);
        response.status(validationError.code);
        throw validationError.error;
      });

      // Save the document
      const document = await doctor.save().catch((error) => {
        console.error(error);
        response.status(errors.SAVE_DOCTOR_FAILED.code);
        throw errors.SAVE_DOCTOR_FAILED.error;
      });

      response.status(201).json(document);
    } catch (error) {
      response.send(error.message);
    }
  });

router.get('/doctors',
  async (request, response) => {
    try {
      // Checks for keys(queryable) in the database
      const queries = Object.keys(request.query);
      const queryable = ['name', 'email', 'phone', 'avatar', 'qualification'];
      const isValidOperation = queries.every((query) => queryable.includes(query));

      // Checks for the valid-Operations
      if (!isValidOperation) {
        const { code, error } = errors.FORBIDDEN_FIELDS_ERROR(queries
          .filter((key) => !queryable.includes(key)));
        response.status(code);
        throw error;
      }

      // Find all or query matching doctors
      const doctors = await Doctor.find(request.query).catch((error) => {
        console.error(error);
        response.status(errors.FIND_DOCTOR_FAILED.code);
        throw errors.FIND_DOCTOR_FAILED.error;
      });

      response.json(doctors);
    } catch (error) {
      response.send(error.message);
    }
  });

router.get('/doctors/:id',
  middlewares.requireDoctor(),
  async (request, response) => {
    try {
      // Get the doctor document
      const doctor = await Doctor.findById(request.params.id)
        .catch((error) => {
          console.error(error);
          response.status(errors.FIND_DOCTOR_FAILED.code);
          throw errors.FIND_DOCTOR_FAILED.error;
        });

      response.json(doctor);
    } catch (error) {
      response.send(error.message);
    }
  });

router.patch('/doctors/:id',
  urlencoded({ extended: true }),
  middlewares.requireHeaders({ accessToken: true, deviceId: true }),
  middlewares.requireVerification({ admin: true }),
  middlewares.requireDoctor(),
  middlewares.requireBody(),
  async (request, response) => {
    try {
      // Checks for keys(updatable) in the database
      const updates = Object.keys(request.body);
      const updatable = ['name', 'email', 'qualification', 'phone'];
      const isValidOperation = updates.every((update) => updatable.includes(update));

      // Checks for the valid-Operations
      if (!isValidOperation) {
        const { code, error } = errors.FORBIDDEN_FIELDS_ERROR(updates
          .filter((key) => !updatable.includes(key)));
        response.status(code);
        throw error;
      }

      // Get the doctor document
      const doctor = await Doctor.findById(request.params.id).catch((error) => {
        console.error(error);
        response.status(errors.FIND_DOCTOR_FAILED.code);
        throw errors.FIND_DOCTOR_FAILED.error;
      });

      updates.forEach((update) => {
        doctor[update] = request.body[update];
      });

      // Validate for custom error handling
      await doctor.validate().catch((error) => {
        console.error(error);
        const validationError = errors.VALIDATION_ERROR(error);
        response.status(validationError.code);
        throw validationError.error;
      });

      await doctor.save().catch((error) => {
        console.error(error);
        response.status(errors.UPDATE_DOCTOR_FAILED.code);
        throw errors.UPDATE_DOCTOR_FAILED.error;
      });

      response.json(doctor);
    } catch (error) {
      response.send(error.message);
    }
  });

router.delete('/doctors/:id',
  middlewares.requireHeaders({ accessToken: true, deviceId: true }),
  middlewares.requireVerification({ admin: true }),
  middlewares.requireDoctor(),
  async (request, response) => {
    try {
      // Delete based on _id
      await Doctor.deleteOne({
        _id: request.params.id,
      }).catch((error) => {
        console.error(error);
        response.status(errors.DELETE_DOCTOR_FAILED.code);
        throw errors.DELETE_DOCTOR_FAILED.error;
      });

      response.send('Doctor deleted');
    } catch (error) {
      response.send(error.message);
    }
  });

const upload = multer({
  dest: 'assets/doctor-avatars',
  limits: { fileSize: 800000 },
  fileFilter(_request, file, callback) {
    if (/^(image)\/(jpeg|jpg|png)$/.test(file.mimetype)) {
      return callback(null, true);
    }
    return callback(null, false);
  },
});

/**
 * `http POST` request handler to upload user profile avatar
 * * Requires `access-token` `device-id` `user-agent`
 */
router.post('/doctors/:id/avatar',
  middlewares.requireHeaders({ accessToken: true, deviceId: true }),
  middlewares.requireVerification({ admin: true }),
  middlewares.requireDoctor(),
  upload.single('file'),
  async (request, response) => {
    try {
      // Check for file existence
      if (!request.file) {
        response.status(errors.NULL_REQUEST_BODY);
        throw errors.NULL_REQUEST_BODY.error;
      }

      await Doctor.updateOne(
        { _id: request.params.userId },
        { avatar: request.file.filename },
      ).catch((error) => {
        console.error(error);
        response.status(errors.FIND_USER_FAILED.code);
        throw errors.FIND_USER_FAILED.error;
      });

      response.send('Avatar uploaded');
    } catch (error) {
      response.send(error.message);
    }
  });

/**
 * `http POST` request handler to upload user profile avatar
 * * Requires `access-token` `device-id` `user-agent`
 */
router.get('/doctors/:id/avatar',
  middlewares.requireDoctor(),
  async (request, response) => {
    try {
    // Get doctor document
      const doctor = await Doctor.findById(request.params.id).catch((error) => {
        console.error(error);
        response.status(errors.FIND_DOCTOR_FAILED.code);
        throw errors.FIND_DOCTOR_FAILED.error;
      });

      // Avatar path
      const avatar = `assets/doctor-avatars/${doctor.avatar}`;

      // Check if file exists
      if (!existsSync(avatar)) {
        response.status(errors.MEDIA_READ_FAILED.code);
        throw errors.MEDIA_READ_FAILED.error;
      }

      const file = readFileSync(avatar);

      response.contentType('jpeg');
      response.send(file);
    } catch (error) {
      response.send(error.message);
    }
  });

module.exports = router;
