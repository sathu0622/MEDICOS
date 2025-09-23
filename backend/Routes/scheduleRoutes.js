import express from "express";
import { body, param } from "express-validator";
import {
  createSlot,
  getSlotsByUser,
  getAllSlots,
  getSlotById,
  updateSlot,
  deleteSlot,
} from "../Controller/ScheduleOperations.js";

const router = express.Router();

// Validation rules for schedule creation
const scheduleValidation = [
  body("userId").isMongoId().withMessage("Invalid user ID"),
  body("doctor").trim().escape().notEmpty().withMessage("Doctor name is required"),
  body("slotDate").isISO8601().withMessage("Invalid date format"),
  body("start").trim().escape().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage("Invalid start time format"),
  body("end").trim().escape().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage("Invalid end time format"),
  body("dContact").trim().escape().matches(/^[0-9]{10}$/).withMessage("Contact number must be 10 digits"),
];

// Routes with validation
router.post("/Schedule", scheduleValidation, createSlot);
router.get("/getslot/user/:email", param("email").isEmail().withMessage("Invalid email"), getSlotsByUser);
router.get("/getslot", getAllSlots);
router.get("/getslot/:id", param("id").isMongoId().withMessage("Invalid slot ID"), getSlotById);
router.put("/updateslot/:id", param("id").isMongoId(), scheduleValidation, updateSlot);
router.delete("/deleteslot/:id", param("id").isMongoId().withMessage("Invalid slot ID"), deleteSlot);

export default router;
