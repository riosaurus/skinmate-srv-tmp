const { Schema, model } = require('mongoose');

const _schema = new Schema({
    parent: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Slots'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

_schema.index({ parent: 1, from: 1 }, { unique: true });

const _model = model("Slot", _schema);

module.exports = { schema: _schema, model: _model };