import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
    userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "users",
                required: true
              },
    Repname: String,
    email: String,
    Contactno: String,
    BookRef: String,
    payRef: String,
    cnum:String,
    type:String,
    cmonth:String,
    cyear:String,
    cvv:String,    
});



const PaymentModel = mongoose.model("PAYSMEDDICOS", PaymentSchema);

export default PaymentModel;
