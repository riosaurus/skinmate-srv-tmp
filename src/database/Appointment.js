const { Schema, model } = require('mongoose');

const _schema = new Schema({
    doctor: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Doctor'
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    slot: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Slots'
    }
}, {
    timestamps: true
});


const _model = model('Appointment', _schema);

module.exports = { schema: _schema, model: _model };
