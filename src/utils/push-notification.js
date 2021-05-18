const axios = require('axios')
const {NOTIFICATION_ACTION,NOTIFICATION_TYPE} = require('./notification-helper')
const {
  FIREBASE_URL,SERVER_KEY
} = require('./variables')
const push_notification = {
  /**
   * function to trigger the request to firebase 
   * @param {Object} body notification body with title,body and data
   */
  request : (body)=>{
    axios({
      method:"POST", 
      url:FIREBASE_URL,
      headers:{
        'Content-Type':'application/json',
        //server api-key for clould messanging
        'Authorization':SERVER_KEY
      },
      data:body
    }).then(response=>{
      if(response.data.success){
        console.log("success..")
        console.log(response.data)
      }
      else{
        console.log(response.data.results[0].error)
      }
    })
    .catch(err=>{
      console.log(err)
    })
    
  },
  /**
   * function to trigger notification
   * @param {*} type type of notifcation to trigger 
   * @param {*} fcm_token device -id for which push notifications triggers
   */
  trigger :(type,fcm_token)=>{
    switch(type){
      case NOTIFICATION_TYPE.CREATE_APPOINMEMT:
        push_notification.request({...NOTIFICATION_ACTION.create,"to":fcm_token})
        break
      case NOTIFICATION_TYPE.UPDATE_APPOINMENT :
        notification.request({...NOTIFICATION_ACTION.reschedule,"to":fcm_token})
        break
      case NOTIFICATION_TYPE.CANCEL_APPOINMENT :
        notification.request({...NOTIFICATION_ACTION.cancel,"to":fcm_token})   
        break 
    }
  }
}

module.exports=push_notification
// push_notification.trigger('create',"etFPAeTdQDiaTusYrLp7Uh:APA91bH4DAEJ0ZGs54cVvsJ-Pq0Qqm83DyNW5LvVmaibdzwQtbC9MW9kqRs9sxUkW7MCZ2doiOANz0ACJysB9-5wZ5jZibwm6Zyf0UCisfgnp-PvPvbla4J8xdYimyotX6EYKKb7eA2A")
