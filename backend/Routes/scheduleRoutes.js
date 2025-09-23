import express from "express";
import {
  createSlot,
  getSlotsByUser,
  getAllSlots,
  getSlotById,
  updateSlot,
  deleteSlot,
} from "../Controller/ScheduleOperations.js";

const router = express.Router();

// Routes
router.post("/Schedule", createSlot);
router.get("/getslot/user/:email", getSlotsByUser);
router.get("/getslot", getAllSlots);
router.get("/getslot/:id", getSlotById);
router.put("/updateslot/:id", updateSlot);
router.delete("/deleteslot/:id", deleteSlot);

export default router;
