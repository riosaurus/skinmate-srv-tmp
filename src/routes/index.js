const UserRouter = require('./User');
const DoctorRouter = require('./Doctor');
const FamilyRouter = require('./Family_member');
const ServiceRouter = require('./Service');
const AppointmentRouter = require('./Appointment');
const LocationRouter = require('./Location')
module.exports = {
  UserRouter,
  DoctorRouter,
  FamilyRouter,
  ServiceRouter,
  AppointmentRouter,
  LocationRouter
};
