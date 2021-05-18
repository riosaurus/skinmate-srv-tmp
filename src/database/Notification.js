const {Schema,model} = require('mongoose')
const push_notification = require('../utils/push-notification')
const notifcationSchema=new Schema({
  user:{
    type:Schema.Types.ObjectId,
    ref:'User'
  },
  for:{
   type:String,
   required:true
  },
  fcm_token:{
   type:String,
   required:true 
  },
  title:{
    type:String,
    required:true
  },
  body:{
    type:String,
    default:''
  },
  data:{
    type:String,
    default:''
  },
  date:{
    type:String,
    required:true
  },
  checked:{
    type:Boolean,
    default:false
  }
},{timestamps:true})

notifcationSchema.post('save',function(){
 push_notification.trigger(this.type,this.fcm_token)
})

module.exports=model('Notification',notifcationSchema)