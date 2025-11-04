import express from "express";
import { createCheckoutSession, verifyPayment, } from "../controllers/stripeController.js";

const router = express.Router();

router.post("/create-checkout-session", createCheckoutSession);
router.get("/success", verifyPayment);
router.get("/cancel", (req, res) => {
  res.send("❌ Payment cancelled");
});

export default router;