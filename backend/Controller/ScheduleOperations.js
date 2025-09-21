import express from "express";
import ScheduleModel from "../Models/Schedule.js"; 
import UserModel from "../Models/User.js";
import cors from 'cors';
import BookModel from "../Models/Booking.js";

const router = express.Router();

router.use(cors());

router.post("/Schedule", async (req, res) => {
    const { userId, doctor, slotDate, start, end, dContact } = req.body;

    // Basic validation
    if (!userId || !doctor || !slotDate || !start || !end || !dContact) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const existingSlot = await ScheduleModel.findOne({
            doctor,
            slotDate,
            $or: [
                { start: { $lt: end }, end: { $gt: start } }
            ]
        });

        if (existingSlot) {
            return res.status(400).json({ 
                message: "Slot overlaps with existing appointment",
                conflictingSlot: existingSlot
            });
        }

        const schedule = new ScheduleModel({
            userId,
            doctor,
            slotDate: new Date(slotDate),
            start,
            end,
            dContact
        });

        await schedule.save();
        res.status(201).json({ 
            success: true,
            message: "Slot added successfully",
            slot: schedule
        });
    } catch (err) {
        console.error("Error adding slot:", err);
        res.status(500).json({ 
            success: false,
            message: "Server error",
            error: err.message 
        });
    }
});

router.get("/getslot/user/:email", async (req, res) => {
    try {
        const { email } = req.params;
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const { doctor, date, isBooked } = req.query;
        const filter = { userId: user._id }; // Use ObjectId now

        if (doctor) filter.doctor = new RegExp(doctor, 'i');
        if (date) filter.slotDate = new Date(date);
        if (isBooked) filter.isBooked = isBooked === 'true';

        const slots = await ScheduleModel.find(filter).sort({ slotDate: 1, start: 1 });

        res.json({
            success: true,
            count: slots.length,
            slots
        });
    } catch (err) {
        console.error("Error fetching slots:", err);
        res.status(500).json({
            success: false,
            message: "Error fetching slots",
            error: err.message
        });
    }
});

router.get("/getslot", async (req, res) => {
    try {
        // Get all slots and populate isBooked status
        const schedule = await ScheduleModel.find({}).lean();
        
        // Get all booked slots
        const bookedSlots = await BookModel.find({}, 'slotId').lean();
        const bookedSlotIds = bookedSlots.map(booking => booking.slotId.toString());
        
        // Mark slots as booked if they exist in bookedSlots
        const slotsWithBookingStatus = schedule.map(slot => ({
            ...slot,
            isBooked: bookedSlotIds.includes(slot._id.toString())
        }));

        res.json(slotsWithBookingStatus);
    } catch (err) {
        console.error("Error fetching slots:", err);
        res.status(500).json({ message: "Error to get slots", error: err });
    }
});

router.delete("/deleteslot/:id", async (req, res) => {
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
});

// Get single slot by ID
router.get("/getslot/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const schedule = await ScheduleModel.findById(id);
        if (!schedule) {
            return res.status(404).json({ message: "Appointment Not available" });
        }
        res.json(schedule);
    } catch (err) {
        res.status(500).json({ message: "Error  ", error: err });
    }
});

// Update slot
router.put("/updateslot/:id", async (req, res) => {
    try {
        const { doctor, slotDate, start, end, dContact } = req.body;
        
        // Basic validation
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
            slot: updatedSlot
        });
    } catch (err) {
        console.error("Error updating slot:", err);
        res.status(500).json({
            success: false,
            message: "Error updating slot",
            error: err.message
        });
    }
});

export default router;
