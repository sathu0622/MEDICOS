import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    mobile: { type: String, required: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    type: { type: String, enum: ["doctor", "admin", "user"], default: "user" }, // role
    password: { type: String, required: true },
    refreshToken: { type: String } // store refresh token for security
}, { timestamps: true });

const UserModel = mongoose.model("users", UserSchema);

export default UserModel;
