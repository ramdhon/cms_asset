const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const rentitemSchema = new Schema({
    daily: { type: Number },
    weekly: { type: Number },
    monthly: { type: Number },
    anually: { type: Number },
    currency: { type: String },
    tax: { type: Number },
    carId: {
        type: Schema.Types.ObjectId, ref: 'Car'
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
        required: [true, 'user must be logged in'],
        type: Schema.Types.ObjectId, ref: 'User'
    },
});
const Rentitem = mongoose.model('Rentitem', rentitemSchema)
module.exports = Rentitem