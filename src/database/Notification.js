const {Schema,model} = require('mongoose')
const push_notification = require('../utils/push-notification')
const notifcationSchema=new Schema({
  user:{
    type:Schema.Types.ObjectId,
    ref:'User'
  },
  type:{
   type:String,
   required:true
  },
  fcm_token:{
   type:String
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
notifcationSchema.pre('save', function (next) {
  this.wasNew = this.isNew;
  next();
})
notifcationSchema.post('save',function(){
   if(this.wasNew){
    push_notification.trigger(this.type,this.fcm_token)
   }
})

module.exports=model('Notification',notifcationSchema)
