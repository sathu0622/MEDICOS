import express from "express";
import BookModel from "../Models/Booking.js"; 
import Slot from "../Models/Schedule.js"
import cors from 'cors';

const router = express.Router();


router.use(cors());


router.post("/Appointment", async (req, res) => {
    console.log("Incoming appointment:", req.body);
    const { userId, slotId, repname, contact, reason, address, company, outcome, date, atime } = req.body;

    if (!userId || !slotId || !repname || !contact || !reason || !address || !date || !atime) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const appointment = new BookModel({
            userId,
            slotId,     // ✅ FIXED LINE: Added this!
            repname,
            contact,
            reason,
            address,
            company,
            outcome,
            date,
            atime
        });

        await appointment.save();
        await Slot.findByIdAndUpdate(slotId, { isBooked: true });

        res.status(201).json({ 
            success: true,
            message: "Appointment scheduled successfully!",
            appointmentId: appointment._id
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ 
            success: false,
            message: "Error creating appointment",
            error: err.message 
        });
    }
});



// In your backend route
router.get("/getappointment/user/:userId", async (req, res) => {
    try {
        const appointments = await BookModel.find({ userId: req.params.userId })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            appointments  // Make sure this matches frontend expectation
        });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({
            success: false,
            message: "Error fetching appointments"
        });
    }
});



router.get("/getappointment", async (req, res) => {
    try {
        const Appointment = await BookModel.find({});
        res.json(Appointment);
    } catch (err) {
        res.status(500).json({ message: "Error fetching bookings", error: err });
    }
});


router.get("/get/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const Appointment = await BookModel.findById(id);
        if (!Appointment) {
            return res.status(404).json({ message: "Appointment Not available" });
        }
        res.json(Appointment);
    } catch (err) {
        res.status(500).json({ message: "Error  ", error: err });
    }
});





router.delete("/deleteappointment/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const deleteappointment = await BookModel.findByIdAndDelete(id);
        if (!deleteappointment) {
            return res.status(404).json({ message: " not found" });
        }
        res.json({ message: "Appointment deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting ", error: err });
    }
});

router.put("/update/:id", async (req, res) => {
    const id = req.params.id;
    const { userId, slotId, repname, contact, reason, address, company, outcome, date, atime }  = req.body;

    try {
        const upadteappointment = await BookModel.findByIdAndUpdate(
            id, 
            { userId, slotId, repname, contact, reason, address, company, outcome, date, atime } , 
            { new: true } 
        );
        if (!upadteappointment) {
            return res.status(404).json({ message: " not found" });
        }
        res.json(upadteappointment);
    } catch (err) {
        res.status(500).json({ message: "Error updating ", error: err });
    }
});

export default router;
