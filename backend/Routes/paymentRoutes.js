// import express from "express";
// import { body, param } from "express-validator";
// import {
//   createPayment,
//   getAllPayments,
//   getPaymentById,
//   getPaymentsByUser,
//   deletePayment,
//   updatePayment,
// } from "../Controller/PaymentOperations.js";
// import { authenticateUser, authorizeRoles } from "../middleware/authenticateUser.js";

// const router = express.Router();

// const paymentValidation = [
//   body("userId").isMongoId().withMessage("Invalid user ID"),
//   body("Repname").trim().escape().notEmpty().withMessage("Name is required"),
//   body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
//   body("Contactno").trim().escape().matches(/^[0-9]{10}$/).withMessage("Contact number must be 10 digits"),
//   body("BookRef").trim().escape().notEmpty().withMessage("Booking reference is required"),
//   body("payRef").trim().escape().notEmpty().withMessage("Payment reference is required"),
//   body("cnum").trim().escape().isLength({ min: 4, max: 4 }).withMessage("Card number must be last 4 digits"),
//   body("type").trim().escape().isIn(['VISA', 'MASTER']).withMessage("Card type must be VISA or MASTER"),
//   body("cmonth").isInt({ min: 1, max: 12 }).withMessage("Invalid month"),
//   body("cyear").isInt({ min: 2025, max: 2035 }).withMessage("Invalid year"),
// ];

// // Routes with validation
// router.post("/pay", authenticateUser, authorizeRoles("user", "admin"), paymentValidation, createPayment);
// router.get("/getpay", authenticateUser, authorizeRoles("admin"), getAllPayments);
// router.get("/getpay/:id", authenticateUser, param("id").isMongoId().withMessage("Invalid payment ID"), getPaymentById);
// router.get("/user/:userId", authenticateUser, param("userId").isMongoId().withMessage("Invalid user ID"), getPaymentsByUser);
// router.put("/updatepay/:id", authenticateUser, param("id").isMongoId().withMessage("Invalid payment ID"), paymentValidation, updatePayment);
// router.delete("/deletepay/:id", authenticateUser, authorizeRoles("admin"), param("id").isMongoId().withMessage("Invalid payment ID"), deletePayment);

// export default router;


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
import { authenticateUser, authorizeRoles } from "../middleware/authenticateUser.js";

const router = express.Router();

const paymentValidation = [
  body("userId").isMongoId().withMessage("Invalid user ID"),
  body("Repname").trim().escape().notEmpty().withMessage("Name is required"),
  body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
  body("Contactno").trim().escape().matches(/^[0-9]{10}$/).withMessage("Contact number must be 10 digits"),
  body("BookRef").trim().escape().notEmpty().withMessage("Booking reference is required"),
  body("payRef").trim().escape().notEmpty().withMessage("Payment reference is required"),
  body("cnum").trim().escape().isLength({ min: 4, max: 4 }).withMessage("Card number must be last 4 digits"),
  body("type").trim().escape().isIn(['VISA', 'MASTER']).withMessage("Card type must be VISA or MASTER"),
  body("cmonth").isInt({ min: 1, max: 12 }).withMessage("Invalid month"),
  body("cyear").isInt({ min: 2025, max: 2035 }).withMessage("Invalid year"),
];

// Routes with validation
router.post("/pay", authenticateUser, authorizeRoles("user", "admin"), paymentValidation, createPayment);
router.get("/getpay", authenticateUser, authorizeRoles("admin"), getAllPayments);
router.get("/getpay/:id", authenticateUser, param("id").isMongoId().withMessage("Invalid payment ID"), getPaymentById);
router.get("/user/:userId", authenticateUser, param("userId").isMongoId().withMessage("Invalid user ID"), getPaymentsByUser);
router.put("/updatepay/:id", authenticateUser, param("id").isMongoId().withMessage("Invalid payment ID"), paymentValidation, updatePayment);
router.delete("/deletepay/:id", authenticateUser, authorizeRoles("admin"), param("id").isMongoId().withMessage("Invalid payment ID"), deletePayment);

export default router;
