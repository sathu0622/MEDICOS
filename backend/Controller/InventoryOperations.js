import express from "express";
import InventoryModel from "../Models/Inventory.js"; 
import cors from 'cors';
import multer from 'multer'
import path from 'path';


const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); 
    }
  });

  const upload = multer({ storage });

  router.post("/Stock", upload.single("Img"), async (req, res) => {
      const { Product, category, Formulation, manufecturer, Regulatory_status, Description, lastUpadte } = req.body;
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
  });
  


router.get("/getstock", async (req, res) => {
    try {
        const inventory = await InventoryModel.find({});
        res.json(inventory);
    } catch (err) {
        res.status(500).json({ message: "Error slots", error: err });
    }
});


router.get("/getstock/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const inventory = await InventoryModel.findById(id);
        if (!inventory) {
            return res.status(404).json({ message: "Stock  Not available" });
        }
        res.json(inventory);
    } catch (err) {
        res.status(500).json({ message: "Error  ", error: err });
    }
});


router.delete("/deletestock/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const deleteSlot = await InventoryModel.findByIdAndDelete(id);
        if (!deleteSlot) {
            return res.status(404).json({ message: " not found" });
        }
        res.json({ message: "Stock details deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting ", error: err });
    }
});

router.put("/updatestock/:id", upload.single("Img"), async (req, res) => {
    const id = req.params.id;
    let Img = req.file ? `uploads/${req.file.filename}` : null;

    const updateData = { ...req.body };
    if (Img) updateData.Img = Img;

    try {
        const updatedStock = await InventoryModel.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedStock) return res.status(404).json({ message: "Stock not found" });
        res.json(updatedStock);
    } catch (err) {
        res.status(500).json({ message: "Error updating stock", error: err });
    }
});

export default router;
