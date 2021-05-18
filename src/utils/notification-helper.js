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
        body:"just for testing..😀",
        title:"from node.js"
        },
       data:{
          message:"FROM NODE JS TEAM..."
        },
    },
    reschedule : {
      notification:{
        body:"just for testing..😀",
        title:"from node.js"
        },
       data:{
          message:"FROM NODE JS TEAM..."
        },
    },
    cancel: {
      notification:{
        body:"just for testing..😀",
        title:"from node.js"
        },
       data:{
          message:"FROM NODE JS TEAM..."
        },
    },
  }
}