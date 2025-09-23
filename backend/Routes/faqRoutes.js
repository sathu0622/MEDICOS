// routes/faqRoutes.js
import express from "express";
import {
    createFAQ,
    getFAQsByUser,
    getAllFAQs,
    getFAQById,
    deleteFAQ,
    updateFAQ
} from "../Controller/FAQOperations.js";

const router = express.Router();

router.post("/ask", createFAQ);
router.get("/getfaq/user/:userId", getFAQsByUser);
router.get("/getfaq", getAllFAQs);
router.get("/getfaq/:id", getFAQById);
router.delete("/deletefaq/:id", deleteFAQ);
router.put("/updatefaq/:id", updateFAQ);

export default router;
