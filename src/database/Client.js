const { Schema, model, Types } = require("mongoose");


const _schema = new Schema({
    userId: {
        type: Types.ObjectId
        // TODO: reference User._id
    },
    userAgent: {
        type: String,
        required: true
    },
    token: {

    }
}, {
    timestamps: true
});

const _model = model("Client", _schema);

module.exports = { schema: _schema, model: _model };