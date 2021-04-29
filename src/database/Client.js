const { Schema, model } = require("mongoose");


const _schema = new Schema({
    userId: {
        type: Schema.Types.ObjectId
        // TODO: reference User._id
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

_schema.statics['findByToken'] = async function (token) {
    return this.findOne({ token });
}

_schema.statics["registerClient"] = async function (userid, device) {
    return this.create({ userid, device });
}

_schema.statics["revokeClient"] = async function (userid, token) {
    return this.findOneAndDelete({ userid, token });
}

const _model = model("Client", _schema);

module.exports = { schema: _schema, model: _model };