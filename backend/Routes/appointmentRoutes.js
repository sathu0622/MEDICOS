import express from "express";
import { body, param } from "express-validator";
import {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
} from "../Controller/AppointmentOperations.js";

const router = express.Router();

// Validation rules for appointment creation
const appointmentValidation = [
  body("userId").isMongoId().withMessage("Invalid user ID"),
  body("slotId").isMongoId().withMessage("Invalid slot ID"),
  body("repname").trim().escape().notEmpty().withMessage("Representative name is required"),
  body("contact").trim().escape().matches(/^[0-9]{10}$/).withMessage("Contact number must be 10 digits"),
  body("reason").trim().escape().notEmpty().withMessage("Reason is required"),
  body("address").trim().escape().notEmpty().withMessage("Address is required"),
  body("company").optional().trim().escape(),
  body("outcome").optional().trim().escape(),
  body("date").isISO8601().withMessage("Invalid date format"),
  body("atime").trim().escape().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage("Invalid time format"),
];

// Routes with validation
router.post("/appointment", appointmentValidation, createAppointment);
router.get("/getappointments", getAllAppointments);
router.get("/getappointment/:id", param("id").isMongoId(), getAppointmentById);
router.put("/updateappointment/:id", param("id").isMongoId(), appointmentValidation, updateAppointment);
router.delete("/deleteappointment/:id", param("id").isMongoId(), deleteAppointment);

export default router;
