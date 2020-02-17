const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const rentlistSchema = new Schema({
    customer: { type: String },
    type: { type: String },
    startPeriod: { type: String },
    endPeriod: { type: String },
    rentItemId: { type: String },
    //sulap-add-models
    //please do not delete comment above
    created: {
        type: Date,
    },
    updated: {
        type: Date,
    },
    refId: {
        required: [true, 'user must be logged in'],
        type: Schema.Types.ObjectId, ref: 'User'
    },
});
const Rentlist = mongoose.model('Rentlist', rentlistSchema)
module.exports = Rentlist