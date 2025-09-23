import PaymentModel from "../Models/Payment.js";
import { validationResult } from "express-validator";

// Create new payment
export const createPayment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { userId, Repname, email, Contactno, BookRef, payRef, cnum, type, cmonth, cyear } = req.body;

  if (!userId || !Repname || !email || !Contactno || !BookRef || !payRef || !cnum || !type || !cmonth || !cyear) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }

  try {
    const payment = new PaymentModel({
      userId,
      Repname,
      email,
      Contactno,
      BookRef,
      payRef,
      cnum, // already last 4 digits from frontend
      type,
      cmonth,
      cyear,
    });

    await payment.save();

    res.status(201).json({
      success: true,
      message: "Payment processed successfully!",
      paymentId: payment._id,
      cardType: type,
    });
  } catch (err) {
    console.error("Payment processing error:", err);
    const statusCode = err.name === "ValidationError" ? 400 : 500;

    res.status(statusCode).json({
      success: false,
      message: "Error processing payment",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

// Get payments by user ID
export const getPaymentsByUser = async (req, res) => {
  try {
    const payments = await PaymentModel.find({ userId: req.params.userId });

    res.json({
      success: true,
      payments,
      count: payments.length,
    });
  } catch (err) {
    console.error("Error getting payments:", err);
    res.status(500).json({
      success: false,
      message: "Failed to get payments",
    });
  }
};

// Get all payments
export const getAllPayments = async (req, res) => {
  try {
    const payment = await PaymentModel.find({});
    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: "Error fetching payments", error: err });
  }
};

// Get payment by ID
export const getPaymentById = async (req, res) => {
  const id = req.params.id;
  try {
    const payment = await PaymentModel.findById(id);
    if (!payment) {
      return res.status(404).json({ message: "Details not available" });
    }
    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: "Error fetching payment", error: err });
  }
};

// Delete payment
export const deletePayment = async (req, res) => {
  const id = req.params.id;
  try {
    const deletePay = await PaymentModel.findByIdAndDelete(id);
    if (!deletePay) {
      return res.status(404).json({ message: "Not found" });
    }
    res.json({ message: "Payment deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting payment", error: err });
  }
};

// Update payment
export const updatePayment = async (req, res) => {
  const id = req.params.id;
  const { Repname, email, Contactno, BookRef, payRef, cnum, type, cmonth, cyear } = req.body;

  try {
    const updatepay = await PaymentModel.findByIdAndUpdate(
      id,
      { Repname, email, Contactno, BookRef, payRef, cnum, type, cmonth, cyear },
      { new: true }
    );
    if (!updatepay) {
      return res.status(404).json({ message: "Not found" });
    }
    res.json(updatepay);
  } catch (err) {
    res.status(500).json({ message: "Error updating payment", error: err });
  }
};
