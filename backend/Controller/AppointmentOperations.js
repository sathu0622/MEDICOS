import BookModel from "../Models/Booking.js";
import Slot from "../Models/Schedule.js";
import { validationResult } from "express-validator";

// Create Appointment
export const createAppointment = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: errors.array()
        });
    }

    console.log("Incoming appointment:", req.body);
    const { userId, slotId, repname, contact, reason, address, company, outcome, date, atime } = req.body;

    try {
        const appointment = new BookModel({
            userId,
            slotId,
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
            error: process.env.NODE_ENV === "development" ? err.message : undefined,
        });
    }
};

// Get appointments by userId
export const getAppointmentsByUser = async (req, res) => {
    try {
        const appointments = await BookModel.find({ userId: req.params.userId })
            .sort({ createdAt: -1 });

        res.json({ success: true, appointments });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({
            success: false,
            message: "Error fetching appointments"
        });
    }
};

// Get all appointments
export const getAllAppointments = async (req, res) => {
    try {
        const appointments = await BookModel.find({});
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ message: "Error fetching bookings", error: err });
    }
};

// Get appointment by ID
export const getAppointmentById = async (req, res) => {
    const { id } = req.params;
    try {
        const appointment = await BookModel.findById(id);
        if (!appointment) {
            return res.status(404).json({ message: "Appointment Not available" });
        }
        res.json(appointment);
    } catch (err) {
        res.status(500).json({ message: "Error", error: err });
    }
};

// Delete appointment
export const deleteAppointment = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await BookModel.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ message: "Appointment not found" });
        }
        res.json({ message: "Appointment deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting", error: err });
    }
};

// Update appointment
export const updateAppointment = async (req, res) => {
    const { id } = req.params;
    const { userId, slotId, repname, contact, reason, address, company, outcome, date, atime } = req.body;

    try {
        const updated = await BookModel.findByIdAndUpdate(
            id,
            { userId, slotId, repname, contact, reason, address, company, outcome, date, atime },
            { new: true }
        );
        if (!updated) {
            return res.status(404).json({ message: "Appointment not found" });
        }
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: "Error updating", error: err });
    }
};
