import ScheduleModel from "../Models/Schedule.js";
import UserModel from "../Models/User.js";
import BookModel from "../Models/Booking.js";
import { validationResult } from "express-validator";

// Create new slot
export const createSlot = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  const { userId, doctor, slotDate, start, end, dContact } = req.body;

  try {
    const existingSlot = await ScheduleModel.findOne({
      doctor,
      slotDate,
      $or: [{ start: { $lt: end }, end: { $gt: start } }],
    });

    if (existingSlot) {
      return res.status(400).json({
        message: "Slot overlaps with existing appointment",
        conflictingSlot: existingSlot,
      });
    }

    const schedule = new ScheduleModel({
      userId,
      doctor,
      slotDate: new Date(slotDate),
      start,
      end,
      dContact,
    });

    await schedule.save();
    res.status(201).json({
      success: true,
      message: "Slot added successfully",
      slot: schedule,
    });
  } catch (err) {
    console.error("Error adding slot:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

// Get slots for a specific user
export const getSlotsByUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email } = req.params;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { doctor, date, isBooked } = req.query;
    const filter = { userId: user._id };

    if (doctor) filter.doctor = new RegExp(doctor, "i");
    if (date) filter.slotDate = new Date(date);
    if (isBooked) filter.isBooked = isBooked === "true";

    const slots = await ScheduleModel.find(filter).sort({ slotDate: 1, start: 1 });

    res.json({
      success: true,
      count: slots.length,
      slots,
    });
  } catch (err) {
    console.error("Error fetching slots:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching slots",
      error: err.message,
    });
  }
};

// Get all slots with booking status
export const getAllSlots = async (req, res) => {
  try {
    const schedule = await ScheduleModel.find({}).lean();
    const bookedSlots = await BookModel.find({}, "slotId").lean();
    const bookedSlotIds = bookedSlots.map((booking) => booking.slotId.toString());

    const slotsWithBookingStatus = schedule.map((slot) => ({
      ...slot,
      isBooked: bookedSlotIds.includes(slot._id.toString()),
    }));

    res.json(slotsWithBookingStatus);
  } catch (err) {
    console.error("Error fetching slots:", err);
    res.status(500).json({ message: "Error to get slots", error: err });
  }
};

// Get slot by ID
export const getSlotById = async (req, res) => {
  const id = req.params.id;
  try {
    const schedule = await ScheduleModel.findById(id);
    if (!schedule) {
      return res.status(404).json({ message: "Appointment not available" });
    }
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ message: "Error fetching slot", error: err });
  }
};

// Update slot
export const updateSlot = async (req, res) => {
  try {
    const { doctor, slotDate, start, end, dContact } = req.body;

    if (!doctor || !slotDate || !start || !end || !dContact) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const updatedSlot = await ScheduleModel.findByIdAndUpdate(
      req.params.id,
      { doctor, slotDate, start, end, dContact },
      { new: true, runValidators: true }
    );

    if (!updatedSlot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    res.json({
      success: true,
      message: "Slot updated successfully",
      slot: updatedSlot,
    });
  } catch (err) {
    console.error("Error updating slot:", err);
    res.status(500).json({
      success: false,
      message: "Error updating slot",
      error: err.message,
    });
  }
};

// Delete slot
export const deleteSlot = async (req, res) => {
  const id = req.params.id;
  try {
    const deleteSlot = await ScheduleModel.findByIdAndDelete(id);
    if (!deleteSlot) {
      return res.status(404).json({ message: "Slot not found" });
    }
    res.json({ message: "Slot deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting slot", error: err });
  }
};
