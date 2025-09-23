import FAQModel from "../Models/FAQ.js";

// Create FAQ
export const createFAQ = async (req, res) => {
    const { userId, username, email, faq } = req.body;

    if (!userId || !username || !email || !faq) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields"
        });
    }

    try {
        const newFAQ = new FAQModel({ userId, username, email, faq });
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
};

// Get FAQs by User
export const getFAQsByUser = async (req, res) => {
    try {
        const faqs = await FAQModel.find({ userId: req.params.userId });
        res.json({ success: true, faqs, count: faqs.length });
    } catch (err) {
        console.error("Error getting FAQs:", err);
        res.status(500).json({ success: false, message: "Failed to get FAQs" });
    }
};

// Get all FAQs
export const getAllFAQs = async (req, res) => {
    try {
        const faqs = await FAQModel.find({});
        res.json(faqs);
    } catch (err) {
        res.status(500).json({ message: "Error getting FAQs", error: err });
    }
};

// Get FAQ by ID
export const getFAQById = async (req, res) => {
    const { id } = req.params;
    try {
        const faq = await FAQModel.findById(id);
        if (!faq) return res.status(404).json({ message: "FAQ not available" });
        res.json(faq);
    } catch (err) {
        res.status(500).json({ message: "Error getting FAQ", error: err });
    }
};

// Delete FAQ
export const deleteFAQ = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedFAQ = await FAQModel.findByIdAndDelete(id);
        if (!deletedFAQ) return res.status(404).json({ message: "FAQ not found" });
        res.json({ message: "FAQ deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting FAQ", error: err });
    }
};

// Update FAQ
export const updateFAQ = async (req, res) => {
    const { id } = req.params;
    const { userId, username, email, faq } = req.body;

    try {
        const updatedFAQ = await FAQModel.findByIdAndUpdate(
            id,
            { userId, username, email, faq },
            { new: true }
        );
        if (!updatedFAQ) return res.status(404).json({ message: "FAQ not found" });
        res.json(updatedFAQ);
    } catch (err) {
        res.status(500).json({ message: "Error updating FAQ", error: err });
    }
};
