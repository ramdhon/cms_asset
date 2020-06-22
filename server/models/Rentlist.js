const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const rentlistSchema = new Schema({
    customer: { type: String },
    type: { type: String },
    startPeriod: {
        required: [true, 'start period must be filled in'],
        type: Date
    },
    endPeriod: {
        required: [true, 'end period must be filled in'],
        type: Date
    },
    discount: { type: Number },
    rentItemId: {
        type: Schema.Types.ObjectId, ref: 'Rentitem'
    },
    customerStatus: { type: String },
    //sulap-add-models
    //please do not delete comment above
    created: {
        type: Date,
    },
    updated: {
        type: Date,
    },
    refId: {
        // required: [true, 'user must be logged in'],
        type: Schema.Types.ObjectId, ref: 'User'
    },
});

rentlistSchema.pre('save', function (next) {
    this.startPeriod = new Date(this.startPeriod);
    this.endPeriod = new Date(this.endPeriod);

    next();
});

rentlistSchema.pre('update', function (next) {
    this.startPeriod = new Date(this.startPeriod);
    this.endPeriod = new Date(this.endPeriod);

    next();
});

const Rentlist = mongoose.model('Rentlist', rentlistSchema)
module.exports = Rentlist