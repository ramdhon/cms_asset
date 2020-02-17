const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const carSchema = new Schema({
    brand: { type: String },
    type: { type: String },
    year: { type: Number },
    policeNo: { type: String },
    vin: { type: String },
    price: { type: Number },
    currency: { type: String },
    status: { type: String },
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
const Car = mongoose.model('Car', carSchema)
module.exports = Car