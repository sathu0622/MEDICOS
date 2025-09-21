import mongoose from "mongoose";

const ScheduleSchema = new mongoose.Schema({

     userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true
          },
    doctor: String,
    slotDate: String,
    duration: String,
    dContact: String,
    start:String,
    end:String    
});



const ScheduleModel = mongoose.model("Schedule", ScheduleSchema);

export default ScheduleModel;
