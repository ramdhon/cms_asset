const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const invoiceSchema = new Schema({
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
    type: Schema.Types.ObjectId, ref: 'Rentlist',
    validate: [
      {
        validator: function (v) {
            return Invoice
                .findOne({
                    _id: {
                        $ne: this._id
                    },
                    rentListId: v
                })
                .then(found => {
                    if (found) {
                        return false;
                    } else {
                        return true;
                    }
                })
                .catch(err => {
                    throw err
                })
        },
        message: 'has been made before'
      }
    ]
  },
});
const Invoice = mongoose.model('Invoice', invoiceSchema)
module.exports = Invoice