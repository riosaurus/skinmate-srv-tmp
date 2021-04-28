const { Schema, model } = require('mongoose')
const validator = require('validator')

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        toLowerCase: true,
        validate: { validator: validator.isEmail, message: "Invalid email address" }
    },
    phone: {
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