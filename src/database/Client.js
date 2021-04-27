const { Schema, model } = require("mongoose");

const _schema = new Schema({
    userAgent: {
        type: String,
        required: true
    }
});

const _model = model("Client", _schema);

module.exports = { schema: _schema, model: _model };