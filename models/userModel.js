import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    phone: {
      type: Number,
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
      required: [true, "required"],
      minlength: [6, "Password be 6 characters"],
    },
    cartData: {
      type: Object,
      default: {},
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
      enum: ["user", "admin", "customer"],
      default: "user",
    },
    permissions: {
      type: [String],
      default: [],
    },
    customPermissions: {
      type: [String],
      default: [], 
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    minimize: false,
    timestamps: true,
  }
);

const UserModel = mongoose.model("User", userSchema);

export default UserModel;