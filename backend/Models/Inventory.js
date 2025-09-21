import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema({
    Product: String,
    category: String,
    Formulation: String,
    manufecturer: String,
    Regulatory_status: String,
    Description: String,
    lastUpadte:String,
    Img:String, 
    
});



const InventoryModel = mongoose.model("inventory", InventorySchema);

export default InventoryModel;
