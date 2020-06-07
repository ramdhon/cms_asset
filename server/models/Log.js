const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const logSchema = new Schema({
    args: { type: String },
    //sulap-add-models
    //please do not delete comment above
    created: {
        type: Date,
    },
});
const Log = mongoose.model('Log', logSchema)
module.exports = Log