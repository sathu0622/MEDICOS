import InventoryModel from "../Models/Inventory.js";
import { validationResult } from "express-validator";
import path from "path";

// CREATE Stock
export const createStock = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    Product,
    category,
    Formulation,
    manufecturer,
    Regulatory_status,
    Description,
    lastUpadte,
  } = req.body;

  const Img = req.file ? `uploads/${req.file.filename}` : "";

  try {
    const inventory = new InventoryModel({
      Product,
      category,
      Formulation,
      manufecturer,
      Regulatory_status,
      Description,
      lastUpadte,
      Img,
    });

    await inventory.save();
    res.status(201).json({ message: "Stock details added!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error!" });
  }
};

// READ all stocks
export const getAllStock = async (req, res) => {
  try {
    const inventory = await InventoryModel.find({});
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ message: "Error fetching stocks", error: err });
  }
};

// READ single stock
export const getStockById = async (req, res) => {
  const id = req.params.id;
  try {
    const inventory = await InventoryModel.findById(id);
    if (!inventory) {
      return res.status(404).json({ message: "Stock not available" });
    }
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ message: "Error fetching stock", error: err });
  }
};

// DELETE stock
export const deleteStock = async (req, res) => {
  const id = req.params.id;
  try {
    const deleteSlot = await InventoryModel.findByIdAndDelete(id);
    if (!deleteSlot) {
      return res.status(404).json({ message: "Stock not found" });
    }
    res.json({ message: "Stock details deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting stock", error: err });
  }
};

// UPDATE stock
export const updateStock = async (req, res) => {
  const id = req.params.id;
  let Img = req.file ? `uploads/${req.file.filename}` : null;

  const updateData = { ...req.body };
  if (Img) updateData.Img = Img;

  try {
    const updatedStock = await InventoryModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedStock)
      return res.status(404).json({ message: "Stock not found" });
    res.json(updatedStock);
  } catch (err) {
    res.status(500).json({ message: "Error updating stock", error: err });
  }
};
