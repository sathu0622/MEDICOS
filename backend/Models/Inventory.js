import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema({
    Product: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    category: {
        type: String,
        required: true,
        trim: true,
        enum: ['Medicine', 'Equipment', 'Supply', 'Other']
    },
    Formulation: {
        type: String,
        trim: true,
        maxlength: 100
    },
    manufecturer: {
        type: String,
        trim: true,
        maxlength: 100
    },
    Regulatory_status: {
        type: String,
        trim: true,
        enum: ['Approved', 'Pending', 'Rejected', 'Under Review']
    },
    Description: {
        type: String,
        trim: true,
        maxlength: 500
    },
    lastUpadte: {
        type: Date,
        default: Date.now
    },
    Img: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

const InventoryModel = mongoose.model("inventory", InventorySchema);

export default InventoryModel;
