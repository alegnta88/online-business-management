import Stripe from "stripe";
import OrderModel from "../models/orderModel.js";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createStripeCheckout = async ({ orderId, email, productName, amount }) => {
  return await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: email,
    metadata: { orderId },
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: productName },
          unit_amount: amount * 100,
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.BASE_URL}/api/v1/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.BASE_URL}/api/v1/stripe/cancel`,
  });
};

export const verifyStripeSession = async (sessionId) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  return session;
};

export const handleStripeWebhookEvent = async (rawBody, sigHeader) => {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const event = stripe.webhooks.constructEvent(rawBody, sigHeader, endpointSecret);

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const orderId = session.metadata?.orderId;

      if (orderId) {
        const order = await OrderModel.findById(orderId);
        if (order) {
          order.paymentStatus = "paid";
          await order.save();
        } else {
          console.warn(`Order not found: ${orderId}`);
        }
      }
      break;
    }

    default:
      console.log(`Unhandled Stripe event type: ${event.type}`);
  }

  return { received: true };
};