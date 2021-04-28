const { Schema, model } = require('mongoose');
const validator = require('validator');


const _schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
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
    },
    avatar: {
        type: Buffer,
        default: []
    },
    qualification: {
        type: String,
        required: true,
    },
    slots: {
        type: Schema.Types.ObjectId,
        ref: 'Slots',
        default: [],
    }
});

const _model = model("Doctor", _schema);

module.exports = { schema: _schema, model: _model };