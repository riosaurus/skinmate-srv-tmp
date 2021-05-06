const { Schema, model } = require('mongoose');
const validator = require('validator');

/**
 * Family schema
 */

const schema = new Schema({
    user : {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    firstName:{
        type:String,
        trim:true

    },
    lastName:{
        type:String,
        trim:true

    },
    relationship:{
        type:String,
        trim:true

    },
    gender:{
        type:String,
        trim:true

    },
    dateOfBirth:Date,
        
    bloodGroup:{
        type:String,
        trim:true
    },
    address:{
        type: String,
        trim: true,
    },
    insurance:{
        type:String,
        trim:true
    },
    emergencyName:{
        type:String,
        trim:true

    },
    emergencyNumber:{
        type: String,
        trim: true,
        validate: { validator: validator.isMobilePhone, message: 'Invalid phone number' },

    }
})

/**
 * Family model
 */

module.exports = model('Family', schema);
