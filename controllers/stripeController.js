import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


export const createCheckoutSession = async (req, res) => {

  try {
    const { amount, email, productName } = req.body;

    if (!amount || !email || !productName) {
      return res.status(400).json({ message: "amount, email, and productName are required" });
    }

    console.log("✅ [Stripe] Data validated. Creating checkout session...");

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: productName,
            },
            unit_amount: amount * 100, 
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.BASE_URL}/api/v1/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL}/api/v1/stripe/cancel`,
    });

    res.status(200).json({ url: session.url });
  } catch (error) {

    res.status(500).json({ message: error.message });
  }
};


export const verifyPayment = async (req, res) => {

  const { session_id } = req.query;

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === "paid") {

      res.status(200).json({ success: true, session });
    } else {
      res.status(400).json({ success: false, message: "Payment not completed" });
    }
  } catch (error) {

    res.status(500).json({ message: error.message });
  }
};