import express from "express";
import { body } from "express-validator";
import {
  createPayment,
  getPaymentsByUser,
  getAllPayments,
  getPaymentById,
  deletePayment,
  updatePayment,
} from "../Controller/PaymentOperations.js";

const router = express.Router();

// Validation rules
const paymentValidation = [
  body("userId").isMongoId().withMessage("Invalid user ID"),
  body("Repname").trim().escape().notEmpty(),
  body("email").isEmail().normalizeEmail(),
  body("Contactno").trim().escape().notEmpty(),
  body("BookRef").trim().escape().notEmpty(),
  body("payRef").trim().escape().notEmpty(),
  body("cnum").isLength({ min: 4, max: 4 }).withMessage("Card number must be last 4 digits"),
  body("type").trim().escape().notEmpty(),
  body("cmonth").trim().escape().notEmpty(),
  body("cyear").trim().escape().notEmpty(),
];

// Routes
router.post("/pay", paymentValidation, createPayment);
router.get("/getpay/user/:userId", getPaymentsByUser);
router.get("/getpay", getAllPayments);
router.get("/getpay/:id", getPaymentById);
router.delete("/deletePay/:id", deletePayment);
router.put("/updatepay/:id", updatePayment);

export default router;
