const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const carSchema = new Schema({
  invoiceNo: { type: String },
  printDate: { type: Date },
  finalDiscount: { type: Number },
  delivery: { type: Number },
  otherExpenses: { type: String },
  //sulap-add-models
  //please do not delete comment above
  created: {
    type: Date,
  },
  updated: {
    type: Date,
  },
  rentListId: {
    required: [true, 'customer id must be provided'],
    type: Schema.Types.ObjectId, ref: 'Rentlist'
  },
});
const Car = mongoose.model('Car', carSchema)
module.exports = Car