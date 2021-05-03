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
        required:true,
        trim:true

    },
    lastName:{
        type:String,
        required:true,
        trim:true

    },
    relationship:{
        type:String,
        trim:true

    },
    gender:{
        type:String,
        required:true,
        trim:true

    },
    dateOfBirth:{
        type:Date,
        required:true

    },
    bloodGroup:{
        type:String,
        trim:true

    },
    address:{
        type: String,
        trim: true,
        required: true,

    },
    insurance:{
        type:String,
        required:true,
        trim:true

    },
    emergencyName:{
        type:String,
        required:true,
        trim:true

    },
    emergencyNumber:{
        type: String,
        required: true,
        trim: true,
        validate: { validator: validator.isMobilePhone, message: 'Invalid phone number' },

    }
})

/**
 * Family model
 */

module.exports = model('Family', schema);
