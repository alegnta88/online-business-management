import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  tx_ref: { type: String, required: true, unique: true },
  reference: { type: String, required: true },
  status: { type: String, required: true },
  amount: { type: Number, required: true },
  charge: { type: Number },
  currency: { type: String, default: "ETB" },
  email: { type: String, required: true },
  first_name: { type: String },
  last_name: { type: String },
  method: { type: String },
  mode: { type: String },
  type: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date },
});

export default mongoose.model("Payment", paymentSchema);