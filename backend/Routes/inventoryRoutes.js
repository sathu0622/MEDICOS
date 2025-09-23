import express from "express";
import multer from "multer";
import path from "path";
import { body } from "express-validator";

import {
  createStock,
  getAllStock,
  getStockById,
  deleteStock,
  updateStock,
} from "../Controller/InventoryOperations.js";

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Validation rules
const stockValidation = [
  body("Product").trim().escape().notEmpty().withMessage("Product is required"),
  body("category").trim().escape().notEmpty().withMessage("Category is required"),
  body("Formulation").trim().escape(),
  body("manufecturer").trim().escape(),
  body("Regulatory_status").trim().escape(),
  body("Description").trim().escape(),
  body("lastUpadte").isISO8601().withMessage("Invalid date"),
];

// Routes
router.post("/Stock", upload.single("Img"), stockValidation, createStock);
router.get("/getstock", getAllStock);
router.get("/getstock/:id", getStockById);
router.delete("/deletestock/:id", deleteStock);
router.put("/updatestock/:id", upload.single("Img"), updateStock);

export default router;
