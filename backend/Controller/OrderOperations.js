import OrderModel from "../Models/Order.js";
import { validationResult } from "express-validator";
import mongoose from "mongoose";

// Security middleware function for orders
const sanitizeOrderInput = (body) => {
  // Whitelist of allowed fields for orders
  const allowedFields = [
    'name', 'email', 'contactNo', 'orderDate',
    'shippingAddress', 'qty', 'remarks'
  ];

  const sanitized = {};

  allowedFields.forEach(field => {
    if (body.hasOwnProperty(field)) {
      const value = body[field];

      // Block dangerous MongoDB operators and keys
      if (typeof value === 'string') {
        // Block values starting with $ (MongoDB operators like $ne, $gt, etc.)
        if (value.startsWith('$')) {
          console.warn(`Blocked dangerous MongoDB operator in ${field}: ${value}`);
          return;
        }
      }

      // Block dangerous object keys
      if (typeof value === 'object' && value !== null) {
        const dangerousKeys = Object.keys(value).filter(key =>
          key.startsWith('$') || key.startsWith('__proto__') || key.startsWith('constructor')
        );

        if (dangerousKeys.length > 0) {
          console.warn(`Blocked object with dangerous keys in ${field}:`, dangerousKeys);
          return;
        }
      }

      sanitized[field] = value;
    }
  });

  return sanitized;
};

// Create order
export const createOrder = async (req, res) => {
  // Apply security sanitization and whitelisting
  const sanitizedBody = sanitizeOrderInput(req.body);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array()
    });
  }

  const { name, email, contactNo, orderDate, shippingAddress, qty, remarks } = sanitizedBody;

  try {
    // Create order with sanitized data
    const order = new OrderModel({
      name,
      email,
      contactNo,
      orderDate: new Date(orderDate),
      shippingAddress,
      qty: parseInt(qty),
      remarks
    });

    await order.save();
    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      orderId: order._id,
    });
  } catch (err) {
    console.error("Order creation error:", err);
    res.status(500).json({
      success: false,
      message: "Error creating order",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

// Get order by ID
export const getOrderById = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid order ID format" });
  }

  try {
    const order = await OrderModel.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching order",
      error: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  }
};

// Update order
export const updateOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid order ID format" });
  }

  const updateData = { ...req.body };

  if (updateData.qty) {
    updateData.qty = parseInt(updateData.qty);
  }
  if (updateData.orderDate) {
    updateData.orderDate = new Date(updateData.orderDate);
  }

  try {
    const updatedOrder = await OrderModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({
      success: true,
      message: "Order updated successfully",
      order: updatedOrder
    });
  } catch (err) {
    res.status(500).json({ 
      message: "Error updating order", 
      error: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  }
};

// Delete order
export const deleteOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid order ID format" });
  }

  try {
    const deletedOrder = await OrderModel.findByIdAndDelete(id);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json({
      success: true,
      message: "Order deleted successfully"
    });
  } catch (err) {
    res.status(500).json({ 
      message: "Error deleting order", 
      error: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  }
};

// Get all orders - Already secure ✅
export const getAllOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find({});
    res.json(orders);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching orders",
      error: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  }
};
