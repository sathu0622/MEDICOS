import mongoose from "mongoose";

const FAQSchema = new mongoose.Schema({
    userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "users",
                required: true
              },

    email: String,
    username: String,
    faq: String,
   
});



const FAQModel = mongoose.model("FAQMedicos", FAQSchema);

export default FAQModel;
