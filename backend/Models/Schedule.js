import mongoose from "mongoose";

const ScheduleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  doctor: {
    type: String,
    required: true,
    trim: true
  },
  slotDate: {
    type: Date,
    required: true
  },
  duration: {
    type: String,
    trim: true
  },
  dContact: {
    type: String,
    required: true,
    trim: true,
    match: /^[0-9]{10}$/
  },
  start: {
    type: String,
    required: true,
    trim: true
  },
  end: {
    type: String,
    required: true,
    trim: true
  },
  isBooked: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});
const ScheduleModel = mongoose.model("Schedule", ScheduleSchema);
export default ScheduleModel;
