import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    contactNo: {
        type: String,
        required: true
    },
    medicineCategory: {
        type: String,
        required: true
    },
    orderDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    shippingAddress: {
        type: String,
        required: true
    },
    qty: {
        type: Number,
        required: true,
        min: 1
    },
    remarks: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'cancelled'],
        default: 'pending'
    }
}, { timestamps: true });

const OrderModel = mongoose.model("OrdersMedicos", OrderSchema);

export default OrderModel;