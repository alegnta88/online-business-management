import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 }, 
    isVerified: { type: Boolean, default: false },
    role: { type: String, enum: ["customer"], default: "customer" },
    isActive: { type: Boolean, default: true },
    cartData: { type: Object, default: {} },
    twoFactorEnabled: { type: Boolean, default: false },
    resetPasswordOTP: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
  },
  { timestamps: true, minimize: false }
);

const CustomerModel = mongoose.model("Customer", customerSchema);
export default CustomerModel;
