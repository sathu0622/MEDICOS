// import express from "express";
// import { body, param } from "express-validator";
// import {
//   createAppointment,
//   getAllAppointments,
//   getAppointmentById,
//   updateAppointment,
//   deleteAppointment,
// } from "../Controller/AppointmentOperations.js";

// const router = express.Router();

// // Validation rules for appointment creation
// const appointmentValidation = [
//   body("userId").isMongoId().withMessage("Invalid user ID"),
//   body("slotId").isMongoId().withMessage("Invalid slot ID"),
//   body("repname").trim().escape().notEmpty().withMessage("Representative name is required"),
//   body("contact").trim().escape().matches(/^[0-9]{10}$/).withMessage("Contact number must be 10 digits"),
//   body("reason").trim().escape().notEmpty().withMessage("Reason is required"),
//   body("address").trim().escape().notEmpty().withMessage("Address is required"),
//   body("company").optional().trim().escape(),
//   body("outcome").optional().trim().escape(),
//   body("date").isISO8601().withMessage("Invalid date format"),
//   body("atime").trim().escape().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage("Invalid time format"),
// ];

// // Routes with validation
// router.post("/appointment", appointmentValidation, createAppointment);
// router.get("/getappointments", getAllAppointments);
// router.get("/getappointment/:id", param("id").isMongoId(), getAppointmentById);
// router.put("/updateappointment/:id", param("id").isMongoId(), appointmentValidation, updateAppointment);
// router.delete("/deleteappointment/:id", param("id").isMongoId(), deleteAppointment);

// export default router;


import express from "express";
import { body, param } from "express-validator";
import {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  getAppointmentsByUser, // Add this import
  updateAppointment,
  deleteAppointment,
} from "../Controller/AppointmentOperations.js";
import { authenticateUser, authorizeRoles } from "../middleware/authenticateUser.js";

const router = express.Router();

const appointmentValidation = [
  body("userId").isMongoId().withMessage("Invalid user ID"),
  body("slotId").isMongoId().withMessage("Invalid slot ID"),
  body("repname").trim().escape().notEmpty().withMessage("Representative name is required"),
  body("contact").trim().escape().isEmail().withMessage("Valid email is required"), // Changed to email validation
  body("reason").trim().escape().notEmpty().withMessage("Reason is required"),
  body("address").trim().escape().notEmpty().withMessage("Address is required"),
  body("company").optional().trim().escape(),
  body("outcome").optional().trim().escape(),
  body("date").notEmpty().withMessage("Date is required"), // Removed strict ISO8601 validation
  body("atime").trim().escape().notEmpty().withMessage("Time is required"), // Simplified time validation
];

// Only logged-in users can create
router.post("/Appointment", authenticateUser, appointmentValidation, createAppointment); // Changed from "/appointment" to "/Appointment"

// Admins can view all
router.get("/getappointments", authenticateUser, authorizeRoles("admin"), getAllAppointments);

// Users can view their own or admin can view any
router.get("/getappointment/:id", authenticateUser, param("id").isMongoId(), getAppointmentById);

// Add this new route for getting user's appointments
router.get("/getappointment/user/:userId", authenticateUser, getAppointmentsByUser);

// Update/Delete restricted
router.put("/updateappointment/:id", authenticateUser, authorizeRoles("admin"), param("id").isMongoId(), appointmentValidation, updateAppointment);
router.delete("/deleteappointment/:id", authenticateUser, authorizeRoles("admin"), param("id").isMongoId(), deleteAppointment);

export default router;
