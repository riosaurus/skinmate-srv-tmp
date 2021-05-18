const { Schema, model } = require('mongoose');
const notification = require('./Notification')
const {NOTIFICATION_ACTION,NOTIFICATION_TYPE} = require('../utils/notification-helper');
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
  date:{
    type:Date,
    required:true
    },
  time:[{
        type:String,
        required:true
    }],
  paymentType:{
      type:String,
      required:true
    },
  insuranceInfo:{
      type:String
    },
  appointmentFor:{
      type:String,
      required:true
    } 
}, {
  timestamps: true,
});
/**
 * creating notifcation for appoinment creation and reschedule
 */
schema.post('save',async function(){
  let time=new Date()
  if(this.isNew){
    let {title,body} = NOTIFICATION_ACTION.create.notification
    let response=await notification({
      user: this.userId,
      type:NOTIFICATION_TYPE.CREATE_APPOINMEMT,
      fcm_token:this.fcm_token,
      title,
      body,
      data:NOTIFICATION_ACTION.create.data.message,
      date:`${time.toDateString()} ${time.toTimeString()}`
    })
    await response.save()
  }
  else{
    let {title,body} = NOTIFICATION_ACTION.reschedule.notification
    let response=await notification({
      user: this.userId,
      type:NOTIFICATION_TYPE.UPDATE_APPOINMENT,
      fcm_token:this.fcm_token,
      title,
      body,
      data:NOTIFICATION_ACTION.reschedule.data.message,
      date:`${time.toDateString()} ${time.toTimeString()}`
    })
    await response.save()
  } 
})
/**
 * creating notification for cancel notification
 */
schema.post('remove',function(){
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
module.exports = model('Appointment', schema);
