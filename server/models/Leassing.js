const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const leassingSchema = new Schema({
    carId: {
        type: Schema.Types.ObjectId, ref: 'Car'
    },
    dealerName: { type: String },
    leassingName: { type: String },
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
const Leassing = mongoose.model('Leassing', leassingSchema)
module.exports = Leassing