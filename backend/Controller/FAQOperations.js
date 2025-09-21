import express from "express";
import cors from 'cors';
import FAQModel from "../Models/FAQ.js";
const router = express.Router();
router.use(cors());

router.post("/ask", async (req, res) => {
    const { userId, username, email, faq } = req.body;

    if (!userId || !username || !email || !faq) {
        return res.status(400).json({ 
            success: false,
            message: "Missing required fields" 
        });
    }

    try {
        const newFAQ = new FAQModel({
            userId,
            username,
            email,
            faq,
        });

        await newFAQ.save();

        res.status(201).json({
            success: true,
            message: "FAQ submitted successfully!",
            faqId: newFAQ._id,
        });

    } catch (err) {
        console.error("FAQ submission error:", err);
        
        const statusCode = err.name === 'ValidationError' ? 400 : 500;
        
        res.status(statusCode).json({
            success: false,
            message: "Error processing FAQ submission",
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

router.get("/getfaq/user/:userId", async (req, res) => {
    try {
        const faqs = await FAQModel.find({ userId: req.params.userId });
        
        res.json({
            success: true,
            faqs: faqs,
            count: faqs.length
        });

    } catch (err) {
        console.error("Error getting FAQs:", err);
        res.status(500).json({
            success: false,
            message: "Failed to get FAQs"
        });
    }
});

router.get("/getfaq", async (req, res) => {
    try {
        const faqs = await FAQModel.find({});
        res.json(faqs);
    } catch (err) {
        res.status(500).json({ message: "Error getting FAQs", error: err });
    }
});

router.get("/getfaq/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const faq = await FAQModel.findById(id);
        if (!faq) {
            return res.status(404).json({ message: "FAQ not available" });
        }
        res.json(faq);
    } catch (err) {
        res.status(500).json({ message: "Error getting FAQ", error: err });
    }
});

router.delete("/deletefaq/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const deletedFAQ = await FAQModel.findByIdAndDelete(id);
        if (!deletedFAQ) {
            return res.status(404).json({ message: "FAQ not found" });
        }
        res.json({ message: "FAQ deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting FAQ", error: err });
    }
});

router.put("/updatefaq/:id", async (req, res) => {
    const id = req.params.id;
    const { userId, username, email, faq } = req.body;

    try {
        const updatedFAQ = await FAQModel.findByIdAndUpdate(
            id, 
            { userId, username, email, faq }, 
            { new: true } 
        );
        if (!updatedFAQ) {
            return res.status(404).json({ message: "FAQ not found" });
        }
        res.json(updatedFAQ);
    } catch (err) {
        res.status(500).json({ message: "Error updating FAQ", error: err });
    }
});

export default router;