import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
    userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  Repname: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  Contactno: {
    type: String,
    required: true,
    trim: true
  },
  BookRef: {
    type: String,
    required: true,
    trim: true
  },
  payRef: {
    type: String,
    required: true,
    trim: true
  },
  cnum: {
    type: String,
    required: true,
    maxlength: 4, // Only last 4 digits
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['VISA', 'MASTER'],
    trim: true
  },
  cmonth: {
    type: String,
    required: true,
    trim: true
  },
  cyear: {
    type: String,
    required: true,
    trim: true
  },
  // CVV is completely removed for security
}, {
  timestamps: true
});

const PaymentModel = mongoose.model("PAYSMEDDICOS", PaymentSchema);

export default PaymentModel;
