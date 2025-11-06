import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    otp: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["customer"],
      default: "customer",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    cartData: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true, 
    minimize: false,
  }
);

const CustomerModel = mongoose.model("Customer", customerSchema);

export default CustomerModel;