/* eslint-disable no-console */
const { Router, urlencoded } = require('express');
const multer = require('multer');
const sharp = require('sharp');
const { middlewares, errors } = require('../utils');
const { Doctor } = require('../database');

const router = Router();
/**
 * @swagger
 * components:
 *   schemas:
 *    Doctor:
 *     type: object
 *     required:
 *      - name
 *      - email
 *      - phone
 *      - qualification
 *     properties:
 *      _id:
 *       type: ObjectdID
 *       description: The auto-generated Id for doctor
 *      name:
 *       type: String
 *       description: name of doctor
 *      email:
 *       type: String
 *       description: email address of doctor
 *      phone:
 *       type: String
 *       description: phone number of doctor
 *      qualification:
 *       type: String
 *       description: qualification of doctor
 *      avatar:
 *       type: Buffer
 *       description: image of doctor(profile picture)
 *      busySlots:
 *       type: Array
 *       description: appoimented slots for doctor
 *     example:
 *      name: PV Bhat
 *      email: pvbhat199@gmail.com
 *      phone: 9988775465
 *      qualification: MBBS    
 */
/**
 * @swagger
 * tags:
 *  name: Doctor
 *  description: Doctor Managing API 
 */

/**
 * @swagger
 * /doctors:
 *  post:
 *   summary: creating doctor account
 *   tags: [Doctor]
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
 *       $ref: '#/components/schemas/Doctor'
 *   responses:
 *    201:
 *     description: doctor account was created successfully
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
  '/doctors',
  urlencoded({ extended: true }),
  middlewares.requireHeaders({ accessToken: true, deviceId: true }),
  middlewares.requireVerification({ admin: true }),
  async (request, response) => {
    try {
      console.log(request.body)
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

      response.json(document);
    } catch (error) {
      response.send(error.message);
    }
  },
);

/**
 * @swagger
 * /doctors:
 *  get:
 *   summary: listing all doctors
 *   tags: [Doctor]
 *   responses:
 *    200:
 *     description: doctors list sent successfully
 *    500:
 *     description: something server error 
 */

router.get(
  '/doctors',
  async (request, response) => {
    try {
      //Checks for keys(queryable) in the database
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
  },
);

/**
 * @swagger
 * /doctors/{id}:
 *  get:
 *   summary: fetching doctor by id
 *   tags: [Doctor]
 *   parameters:
 *    - in: path
 *      name: id
 *      type: String
 *      required: true
 *      description: doctor id
 *   responses:
 *    200:
 *     description: successfully fetched doctor deatails by id
 *    500:
 *     description: could not found doctor 
 */
router.get(
  '/doctors/:id',
  async (request, response) => {
    try {
      // Get the doctor document
      const doctor = await Doctor.findById(request.params.id)
        .catch((error) => {
          console.error(error);
          response.status(errors.FIND_DOCTOR_FAILED.code);
          throw errors.FIND_DOCTOR_FAILED.error;
        });

      if (!doctor) {
        response.status(errors.NULL_DOCTOR.code);
        throw errors.NULL_DOCTOR.error;
      }

      response.json(doctor);
    } catch (error) {
      response.send(error.message);
    }
  },
);

/**
 * @swagger
 * /doctors/{id}:
 *  patch:
 *   summary: updating doctor account
 *   tags: [Doctor]
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
 *       $ref: '#/components/schemas/Doctor'  
 *   responses:
 *    200:
 *     description: doctor account was updated successfully
 *    500:
 *     description: something server error
 *    401:
 *     description: unauthorized access-token
 *    403:
 *     description: Operation requires 'device-id'
 *    
 */
router.patch(
  '/doctors/:id',
  urlencoded({ extended: true }),
  middlewares.requireHeaders({ accessToken: true, deviceId: true }),
  middlewares.requireVerification({ admin: true }),
  async (request, response) => {
    try {
      //Checks for keys(updatable) in the database
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
  },
);

/**
 * @swagger
 * /doctors/{id}:
 *  delete:
 *   summary: deleting doctor account
 *   tags: [Doctor]
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
 *   responses:
 *    200:
 *     description: doctor account was deleted successfully
 *    500:
 *     description: something server error
 *    401:
 *     description: unauthorized access-token
 *    403:
 *     description: Operation requires 'device-id'
 *    
 */
router.delete(
  '/doctors/:id',
  middlewares.requireHeaders({ accessToken: true, deviceId: true }),
  middlewares.requireVerification({ admin: true }),
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
  },
);

const upload = multer({
  limits: { fileSize: 1000000 },
  fileFilter(_request, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Please upload a jpeg or jpg or png'));
    }
    return cb(null, true);
  },
}); 

/**
 * @swagger
 * tags:
 *  name: Doctor
 *  description: Doctor Managing API 
 */

/**
 * @swagger
 * /doctor/{id}/avatar:
 *  post:
 *   summary: uploading doctor profile picture
 *   tags: [Doctor]
 *   consumes:
 *    - multipart/form-data
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
 *    content:
 *     multipart/form-data:
 *      schema:
 *       type: object
 *       properties:
 *        file:
 *         type: file
 *         format: binary
 *         description: image for doctor profile picture
 *   responses:
 *    200:
 *     description: doctor profile picture added successfully
 *    500:
 *     description: something server error
 *    401:
 *     description: unauthorized access-token
 *    403:
 *     description: Operation requires 'device-id'
 *    
 */

router.post(
  '/doctor/:id/avatar', upload.single('file'),
  middlewares.requireHeaders({ accessToken: true, deviceId: true }),
  middlewares.requireVerification({ admin: true }),
  //Use buffer for avatar upload
  async (request, response) => {
    const buffer = await sharp(request.file.buffer).png().toBuffer();
    const doctor = await Doctor.findById(request.params.id);
    doctor.avatar = buffer;
    await doctor.save();
    response.send();
  }, (error, request, response, next) => {
    console.log(error);
    response.status(400).send({ error });
  },
);

module.exports = router;
