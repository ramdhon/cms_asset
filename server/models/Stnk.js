const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const stnkSchema = new Schema({
    carId: {
        type: Schema.Types.ObjectId, ref: 'Car'
    },
    taxFee: { type: Number },
    taxCurrency: { type: String },
    stnkStart: {
        type: Date,
    },
    stnkEnd: {
        type: Date,
    },
    taxStart: {
        type: Date,
    },
    taxEnd: {
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
const Stnk = mongoose.model('Stnk', stnkSchema)
module.exports = Stnk