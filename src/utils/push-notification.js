const fetch = require('node-fetch')
const {NOTIFICATION_ACTION,NOTIFICATION_TYPE} = require('./notification-helper')
const {
  FIREBASE_URL,SERVER_KEY
} = require('./variables')
const push_notification = {
  request : (body)=>{
    fetch(
    FIREBASE_URL,
    {
      'method':'POST',
      'headers':{
        'Authorization':SERVER_KEY
      },
      body:JSON.stringify(body)
    }  
  )
  },
  trigger :({fcm_tokens,type})=>{
    switch(type){
      case NOTIFICATION_TYPE.CREATE_APPOINMENT :
        notification.request({'notification':NOTIFICATION_ACTION[type],'registration_ids':fcm_tokens})
        break
      case NOTIFICATION_TYPE.UPDATE_APPOINMENT :
        notification.request({body:NOTIFICATION_ACTION[type],cred:fcm_tokens})
        break
      case NOTIFICATION_TYPE.CANCEL_APPOINMENT :
        notification.request({body:NOTIFICATION_ACTION[type],cred:fcm_tokens})   
        break 
    }
  }
}

module.exports= push_notification ;