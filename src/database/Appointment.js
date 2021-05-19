const { Schema, model } = require('mongoose');
const notification = require('./Notification');
const { NOTIFICATION_ACTION, NOTIFICATION_TYPE } = require('../utils/notification-helper');
const schema = new Schema({
  doctorId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Doctor',
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  date: {
    type: Date,
    required: true,
  },
  time: [{
    type: String,
    required: true,
  }],
  paymentType: {
    type: String,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  insuranceInfo: {
    type: String,
  },
  appointmentFor: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

/**
 * creating notifcation for appoinment creation and reschedule
 */
schema.pre('save',function(next){
   this.wasNew=this.isNew
   next()
})
schema.post('save', async function onSave() {
  try {
  const time = new Date();
  let user=this
  let user_data=await user.populate({
    path:'userId',
    select:'fcm_token'
  }).execPopulate()
  if (this.wasNew) {
    try {
      const { title, body } = NOTIFICATION_ACTION.create.notification;
    const response = await notification({
      user: this.userId,
      type: NOTIFICATION_TYPE.CREATE_APPOINMEMT,
      fcm_token:user_data.userId.fcm_token,
      title,
      body,
      data: NOTIFICATION_ACTION.create.data.message,
      date: `${time.toDateString()} ${time.toTimeString()}`,
    });
    await response.save();
    } catch (error) {
      console.log("unable to create notification"+error)
    }
  } else {
    try {
      const { title, body } = NOTIFICATION_ACTION.reschedule.notification;
    const response = await notification({
      user: this.userId,
      type: NOTIFICATION_TYPE.UPDATE_APPOINMENT,
      fcm_token:user_data.userId.fcm_token,
      title,
      body,
      data: NOTIFICATION_ACTION.reschedule.data.message,
      date: `${time.toDateString()} ${time.toTimeString()}`,
    });
    await response.save();
    } catch (error) {
      console.log("unable to create notification"+error)
    }
  }
  } catch (error) {
    console.log(error)
  }
});

/**
 * creating notification for cancel notification
 */
schema.post('remove', async function onRemove() {
  try {
  const time = new Date();
  let user=this
  let user_data=await user.populate({
    path:'userId',
    select:'fcm_token'
  }).execPopulate()
  const { title, body } = NOTIFICATION_ACTION.cancel.notification;
  const response = await notification({
    user: this.userId,
    type: NOTIFICATION_TYPE.CANCEL_APPOINMENT,
    fcm_token: user_data.userId.fcm_token,
    title,
    body,
    data: NOTIFICATION_ACTION.cancel.data.message,
    date: `${time.toDateString()} ${time.toTimeString()}`,
  });
  await response.save();
  } catch (error) {
    console.log(error) 
  }
});

module.exports = model('Appointment', schema);
