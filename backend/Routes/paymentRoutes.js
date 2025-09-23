import express from "express";
import { body, param } from "express-validator";
import {
  createPayment,
  getAllPayments,
  getPaymentById,
  getPaymentsByUser,
  deletePayment,
  updatePayment,
} from "../Controller/PaymentOperations.js";

const router = express.Router();

// Validation rules for payment creation
const paymentValidation = [
  body("userId").isMongoId().withMessage("Invalid user ID"),
  body("Repname").trim().escape().notEmpty().withMessage("Name is required"),
  body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
  body("Contactno").trim().escape().matches(/^[0-9]{10}$/).withMessage("Contact number must be 10 digits"),
  body("BookRef").trim().escape().notEmpty().withMessage("Booking reference is required"),
  body("payRef").trim().escape().notEmpty().withMessage("Payment reference is required"),
  body("cnum").trim().escape().isLength({ min: 4, max: 4 }).withMessage("Card number must be last 4 digits"),
  body("type").trim().escape().isIn(['VISA', 'MASTER']).withMessage("Invalid card type"),
  body("cmonth").trim().escape().isInt({ min: 1, max: 12 }).withMessage("Invalid month"),
  body("cyear").trim().escape().isInt({ min: 2025, max: 2035 }).withMessage("Invalid year"),
];

// Validation for updating payment
const updatePaymentValidation = [
  param("id").isMongoId().withMessage("Invalid payment ID"),
  body("Repname").optional().trim().escape(),
  body("email").optional().isEmail().normalizeEmail(),
  body("Contactno").optional().trim().escape().matches(/^[0-9]{10}$/),
  body("BookRef").optional().trim().escape(),
  body("payRef").optional().trim().escape(),
  body("cnum").optional().trim().escape().isLength({ min: 4, max: 4 }),
  body("type").optional().trim().escape().isIn(['VISA', 'MASTER']),
  body("cmonth").optional().trim().escape().isInt({ min: 1, max: 12 }),
  body("cyear").optional().trim().escape().isInt({ min: 2025, max: 2035 }),
];

// Routes with validation
router.post("/pay", paymentValidation, createPayment);
router.get("/getpay", getAllPayments);
router.get("/getpay/:id", param("id").isMongoId().withMessage("Invalid payment ID"), getPaymentById);
router.get("/user/:userId", param("userId").isMongoId().withMessage("Invalid user ID"), getPaymentsByUser);
router.delete("/deletepay/:id", param("id").isMongoId().withMessage("Invalid payment ID"), deletePayment);
router.put("/updatepay/:id", updatePaymentValidation, updatePayment);

export default router;
