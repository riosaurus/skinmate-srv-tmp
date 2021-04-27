const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        toLowerCase:true,
        validate(email){
            if(!validator.isEmail(email)){
                throw new Error('Invalid email address')
            }
        }
    },
    phone:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true

    },
    name: {
        type:String,
        default:'abc'

    },
    address: {
 type:String,
 required:true
    },
    devices: [
        {
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:'Client'
        }
    ],
    family: [

    ],
 
    
    verifiedPhone: {
        type:Boolean,
        default:false

    },
    verifiedEmail : {
        type:Boolean,
        default:false

    }

})

const User = mongoose.model('User',userSchema)

module.exports = User