import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
      },

      slotId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Schedule",
        required: true
    },
      repname: {
        type: String,
        required: true
      },
      contact: {
        type: String,
        required: true
      },
      reason: {
        type: String,
        required: true
      },
      address: {
        type: String,
        required: true
      },
      company: {
        type: String
      },
      outcome: {
        type: String
      },
      date: {
        type: Date,
        required: true
      },
      atime: {
        type: String,
        required: true
      }
        


    
});



const BookModel = mongoose.model("bookings", AppointmentSchema);

export default BookModel;
