import express from "express";
import cors from 'cors';
import OrderModel from "../Models/Order.js";

const router = express.Router();


// Create new order
router.post("/order", async (req, res) => {
    const { userId, name, email, contactNo, medicineCategory, orderDate, shippingAddress, qty, remarks } = req.body;

    // Validation
    if (!userId || !name || !email || !contactNo || !medicineCategory || !orderDate || !shippingAddress || !qty) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields"
        });
    }

    try {
        const order = new OrderModel({
            userId,
            name,
            email,
            contactNo,
            medicineCategory,
            orderDate: new Date(orderDate),
            shippingAddress,
            qty: Number(qty),
            remarks: remarks || ""
        });

        await order.save();
        res.status(201).json({
            success: true,
            message: "Order placed successfully!",
            orderId: order._id
        });
    } catch (err) {
        console.error("Order creation error:", err);
        res.status(500).json({
            success: false,
            message: "Error placing order",
            error: err.message
        });
    }
});

// Get all orders
router.get("/getorder", async (req, res) => {
    try {
        const orders = await OrderModel.find({});
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: "Error fetching orders", error: err });
    }
});

router.get("/getorder/user/:email", async (req, res) => {
    try {
        const orders = await OrderModel.find({ email: req.params.email })
            .populate('userId', 'name email mobile')
            .sort({ createdAt: -1 });
            
        res.json({
            success: true,
            count: orders.length,
            orders
        });
    } catch (err) {
        console.error("Get user orders error:", err);
        res.status(500).json({
            success: false,
            message: "Error fetching user orders",
            error: err.message
        });
    }
});

// Get single order by ID
// router.get("/getorder/:id", async (req, res) => {
//     try {
//         const order = await OrderModel.findById(req.params.id)
//             .populate('userId', 'name email mobile');
            
//         if (!order) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Order not found"
//             });
//         }
        
//         res.json({
//             success: true,
//             order
//         });
//     } catch (err) {
//         console.error("Get order error:", err);
//         res.status(500).json({
//             success: false,
//             message: "Error fetching order",
//             error: err.message
//         });
//     }
// });

router.get("/getorder/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const order = await OrderModel.findById(id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: "Error fetching order", error: err });
    }
});

// Update order
router.put("/updateorder/:id", async (req, res) => {
    const updates = {};
    const allowedUpdates = ['name', 'email', 'contactNo', 'medicineCategory', 'orderDate', 'shippingAddress', 'qty', 'remarks', 'status'];
    
    // Filter only allowed updates
    Object.keys(req.body).forEach(key => {
        if (allowedUpdates.includes(key)) {
            updates[key] = req.body[key];
        }
    });

    try {
        const order = await OrderModel.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.json({
            success: true,
            message: "Order updated successfully",
            order
        });
    } catch (err) {
        console.error("Update order error:", err);
        res.status(500).json({
            success: false,
            message: "Error updating order",
            error: err.message
        });
    }
});

// Delete order
router.delete("/deleteorder/:id", async (req, res) => {
    try {
        const order = await OrderModel.findByIdAndDelete(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.json({
            success: true,
            message: "Order deleted successfully"
        });
    } catch (err) {
        console.error("Delete order error:", err);
        res.status(500).json({
            success: false,
            message: "Error deleting order",
            error: err.message
        });
    }
});

export default router;