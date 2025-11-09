import {
  createStripeCheckout,
  verifyStripeSession,
  handleStripeWebhookEvent,
} from "../services/stripeService.js";

export const createCheckoutSession = async (req, res) => {
  const { orderId, email, productName, amount } = req.body;

  if (!orderId || !email || !productName || !amount) {
    return res
      .status(400)
      .json({ message: "orderId, email, productName, and amount are required" });
  }

  try {
    const session = await createStripeCheckout({ orderId, email, productName, amount });
    res.status(200).json({ url: session.url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  const { session_id } = req.query;

  try {
    const session = await verifyStripeSession(session_id);

    if (session.payment_status === "paid") {
      res.status(200).json({ success: true, session });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Payment not completed" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const stripeWebhookHandler = async (req, res) => {
  try {
    const sig = req.headers["stripe-signature"];
    const result = await handleStripeWebhookEvent(req.body, sig);
    res.json(result);
  } catch (error) {
    console.error("Webhook Error:", error.message);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
};