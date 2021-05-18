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
schema.post('save', async function onSave() {
  const time = new Date();
  if (this.isNew) {
    const { title, body } = NOTIFICATION_ACTION.create.notification;
    const response = await notification({
      user: this.userId,
      type: NOTIFICATION_TYPE.CREATE_APPOINMEMT,
      fcm_token: this.fcm_token,
      title,
      body,
      data: NOTIFICATION_ACTION.create.data.message,
      date: `${time.toDateString()} ${time.toTimeString()}`,
    });
    await response.save();
  } else {
    const { title, body } = NOTIFICATION_ACTION.reschedule.notification;
    const response = await notification({
      user: this.userId,
      type: NOTIFICATION_TYPE.UPDATE_APPOINMENT,
      fcm_token: this.fcm_token,
      title,
      body,
      data: NOTIFICATION_ACTION.reschedule.data.message,
      date: `${time.toDateString()} ${time.toTimeString()}`,
    });
    await response.save();
  }
});

/**
 * creating notification for cancel notification
 */
<<<<<<< HEAD
schema.post('remove',async function(){
  let time=new Date()
  let {title,body} = NOTIFICATION_ACTION.cancel.notification
    let response=await notification({
      user: this.userId,
      type:NOTIFICATION_TYPE.CANCEL_APPOINMENT,
      fcm_token:this.fcm_token,
      title,
      body,
      data:NOTIFICATION_ACTION.cancel.data.message,
      date:`${time.toDateString()} ${time.toTimeString()}`,
    })
    await response.save()
})
=======
schema.post('remove', async function onRemove() {
  const time = new Date();
  const { title, body } = NOTIFICATION_ACTION.cancel.notification;
  const response = await notification({
    user: this.userId,
    type: NOTIFICATION_TYPE.CANCEL_APPOINMENT,
    fcm_token: this.fcm_token,
    title,
    body,
    data: NOTIFICATION_ACTION.cancel.data.message,
    date: `${time.toDateString()} ${time.toTimeString()}`,
  });
  await response.save();
});

>>>>>>> 2358c33d6fc43f7b6d311658e895b6ab90b00725
module.exports = model('Appointment', schema);
