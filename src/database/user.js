const { Schema, model } = require('mongoose');
const { genSalt, hash } = require('bcryptjs');
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
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

_schema.pre("save", async function () {
    if (this.isModified("password")) {
        const salt = await genSalt(8);
        const hashed = await hash(this.password, salt);
        this.password = hashed;
    }
});

const _model = model('User', _schema)

module.exports = { schema: _schema, model: _model };