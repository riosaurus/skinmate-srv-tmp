const mongoose=require('mongoose')
const validator=require('validator')

const DoctorSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
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
        required:true,
        unique:true,
    },
    avatar:{
        type:Buffer,
        default:[]
    },
    qualification:{
        type:String,
        required:true,
    },
    slots:{
        default:[],
        ref:'Slots'
    }
})

const Doctor=mongoose.model('Doctor',DoctorSchema)

module.exports=Doctor