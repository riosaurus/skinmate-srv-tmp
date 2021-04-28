const { Schema, model } = require("mongoose");


const _schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userAgent: {
        type: String,
        required: true
    },
    token: {
        type: String,
        unique: true
    }
}, {
    timestamps: true
});

_schema.pre("save", function () {
    this.token = sign(this.id, Environment.TOKEN_KEY());
});

const _model = model("Client", _schema);

module.exports = { schema: _schema, model: _model };