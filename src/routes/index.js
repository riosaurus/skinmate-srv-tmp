const UserRouter = require('./User');
const DoctorRouter=require('./Doctor')
const FamilyRouter = require('./Family_member');
const ServiceRouter= require('./Service')
const AppointmentRouter = require('./Appointment')
module.exports = {
  UserRouter,
  DoctorRouter,
  FamilyRouter,
  ServiceRouter,
  AppointmentRouter
};
