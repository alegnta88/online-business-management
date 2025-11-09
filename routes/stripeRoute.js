import express from "express";
import bodyParser from "body-parser";
import { createCheckoutSession, verifyPayment, stripeWebhookHandler } from "../controllers/stripeController.js";

const router = express.Router();

router.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  stripeWebhookHandler
);

router.use(express.json());

router.post("/create-checkout-session", createCheckoutSession);
router.get("/success", verifyPayment);
router.get("/cancel", (req, res) => res.send("❌ Payment cancelled"));

export default router;