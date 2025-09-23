import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrdersByUserEmail,
  getOrderById,
  updateOrder,
  deleteOrder,
} from "../Controller/OrderOperations.js";

const router = express.Router();

// Routes
router.post("/order", createOrder);
router.get("/getorder", getAllOrders);
router.get("/getorder/user/:email", getOrdersByUserEmail);
router.get("/getorder/:id", getOrderById);
router.put("/updateorder/:id", updateOrder);
router.delete("/deleteorder/:id", deleteOrder);

export default router;
