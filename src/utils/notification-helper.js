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
    create : {
      notification:{
        body:"apppoinment scheduled succesfully.",
        title:"Skin-Mate"
        },
       data:{
          message:""
        },
    },
    reschedule : {
      notification:{
        body:"appoinment re-scheduled.",
        title:"Skin-Mate"
        },
       data:{
          message:""
        },
    },
    cancel: {
      notification:{
        body:"appoinment canceled",
        title:"Skin-Mate"
        },
       data:{
          message:""
        },
    },
  }
}