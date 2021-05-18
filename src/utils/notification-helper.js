const date =new Date()
module.exports={
  NOTIFICATION_TYPE : 
  {
    CREATE_APPOINMEMT : 'create',
    UPDATE_APPOINMENT : 're-schedule',
    CANCEL_APPOINMENT :  'cancel'
  },
  NOTIFICATION_ACTION : 
  {
    'create' : {
      title : '',
      subtitle :``,
      body : '',
    },
    're-schedule' : {
      title : '',
      subtitle : '',
      body : '',
    },
    'cancel' : {
      title : '',
      subtitle : '',
      body : '',
    },
  }
}