const { Schema, model } = require('mongoose');
const bcrypt=require('bcryptjs')
const validator = require('validator');
const Client = require('./Client');

const _schema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        toLowerCase: true,
        validate: { validator: validator.isEmail, message: "Invalid email address" }
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: { validator: validator.isMobilePhone, message: "Invalid phone number" }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate: { validator: validator.isStrongPassword, message: "Weak password" }
    },
    name: {
        type: String,
        trim: true,
        default: "User"
    },
    address: {
        type: String,
        required: true
    },
    devices: [{
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Client'
    }],
    family: [],
    verifiedPhone: {
        type: Boolean,
        default: false
    },
    verifiedEmail : {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
_schema.methods.toJSON=function(){
    let userObject=this.user.toObject()
    delete userObject.password
    return userObject
}
_schema.pre('save',async function(){
    if(this.user.password.modified){
        user.password=await bcrypt.hash(this.user.password,8)
    }
})
const _model = model('User',_schema)

module.exports = { schema: _schema, model: _model };