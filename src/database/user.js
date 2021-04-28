const { Schema, model } = require('mongoose');
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
        ref: Client.schema
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

const _model = model('User',userSchema)

module.exports = { schema: _schema, model: _model };