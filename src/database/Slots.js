const { Schema, model } = require('mongoose');

const _schema = new Schema({
    day: {
        type: Date,
        default: Date.now
    },
    doctor: {
        type: Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    slots: [{
        type: Schema.Types.ObjectId,
        ref: 'Slot'
    }]
}, {
    timestamps: true
});

_schema.index({ day: 1, doctor: 1 }, { unique: true });

const _model = model("Slots", _schema);

module.exports = { schema: _schema, model: _model };