import express from "express";
import {
    createAppointment,
    getAppointmentsByUser,
    getAllAppointments,
    getAppointmentById,
    deleteAppointment,
    updateAppointment
} from "../Controller/AppointmentOperations.js";

const router = express.Router();

// Appointment routes
router.post("/appointment", createAppointment);
router.get("/getappointment/user/:userId", getAppointmentsByUser);
router.get("/getappointment", getAllAppointments);
router.get("/get/:id", getAppointmentById);
router.delete("/deleteappointment/:id", deleteAppointment);
router.put("/update/:id", updateAppointment);

export default router;
