// import express from "express";
// import { body, param } from "express-validator";
// import {
//   createOrder,
//   getAllOrders,
//   getOrderById,
//   updateOrder,
//   deleteOrder,
// } from "../Controller/OrderOperations.js";

// const router = express.Router();

// // Validation rules for order creation
// const orderValidation = [
//   body("name").trim().escape().notEmpty().withMessage("Name is required"),
//   body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
//   body("contactNo").trim().escape().matches(/^[0-9]{10}$/).withMessage("Contact number must be 10 digits"),
//   body("medicineCategory").trim().escape().notEmpty().withMessage("Medicine category is required"),
//   body("orderDate").isISO8601().withMessage("Invalid date format"),
//   body("shippingAddress").trim().escape().notEmpty().withMessage("Shipping address is required"),
//   body("qty").isInt({ min: 1 }).withMessage("Quantity must be a positive integer"),
//   body("remarks").optional().trim().escape(),
// ];

// // Validation for order updates
// const updateOrderValidation = [
//   param("id").isMongoId().withMessage("Invalid order ID"),
//   body("name").optional().trim().escape(),
//   body("email").optional().isEmail().normalizeEmail(),
//   body("contactNo").optional().trim().escape().matches(/^[0-9]{10}$/),
//   body("medicineCategory").optional().trim().escape(),
//   body("orderDate").optional().isISO8601(),
//   body("shippingAddress").optional().trim().escape(),
//   body("qty").optional().isInt({ min: 1 }),
//   body("remarks").optional().trim().escape(),
// ];

// // Routes with validation
// router.post("/order", orderValidation, createOrder);
// router.get("/getorders", getAllOrders);
// router.get("/getorder/:id", param("id").isMongoId().withMessage("Invalid order ID"), getOrderById);
// router.put("/updateorder/:id", updateOrderValidation, updateOrder);
// router.delete("/deleteorder/:id", param("id").isMongoId().withMessage("Invalid order ID"), deleteOrder);

// export default router;


import express from "express";
import { body, param } from "express-validator";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} from "../Controller/OrderOperations.js";
import { authenticateUser, authorizeRoles } from "../middleware/authenticateUser.js";

const router = express.Router();

const orderValidation = [
  body("name").trim().escape().notEmpty().withMessage("Name is required"),
  body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
  body("contactNo").trim().escape().matches(/^[0-9]{10}$/).withMessage("Contact number must be 10 digits"),
  body("medicineCategory").trim().escape().notEmpty().withMessage("Medicine category is required"),
  body("orderDate").isISO8601().withMessage("Invalid date format"),
  body("shippingAddress").trim().escape().notEmpty().withMessage("Shipping address is required"),
  body("qty").isInt({ min: 1 }).withMessage("Quantity must be a positive integer"),
  body("remarks").optional().trim().escape(),
];

const updateOrderValidation = [
  param("id").isMongoId().withMessage("Invalid order ID"),
  body("name").optional().trim().escape(),
  body("email").optional().isEmail().normalizeEmail(),
  body("contactNo").optional().trim().escape().matches(/^[0-9]{10}$/),
  body("medicineCategory").optional().trim().escape(),
  body("orderDate").optional().isISO8601(),
  body("shippingAddress").optional().trim().escape(),
  body("qty").optional().isInt({ min: 1 }),
  body("remarks").optional().trim().escape(),
];

router.post("/order", authenticateUser, authorizeRoles("user", "admin"), orderValidation, createOrder);
router.get("/getorders", authenticateUser, authorizeRoles("admin"), getAllOrders);
router.get("/getorder/:id", authenticateUser, param("id").isMongoId(), getOrderById);
router.put("/updateorder/:id", authenticateUser, authorizeRoles("admin"), updateOrderValidation, updateOrder);
router.delete("/deleteorder/:id", authenticateUser, authorizeRoles("admin"), param("id").isMongoId(), deleteOrder);

export default router;
