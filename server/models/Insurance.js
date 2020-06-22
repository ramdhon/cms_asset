const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const insuranceSchema = new Schema({
    carId: {
        type: Schema.Types.ObjectId, ref: 'Car'
    },
    name: { type: String },
    coverageType: { type: String },
    polisNo: { type: String },
    start: {
        type: Date,
    },
    end: {
        type: Date,
    },
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
const Insurance = mongoose.model('Insurance', insuranceSchema)
module.exports = Insurance