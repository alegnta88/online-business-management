import { validatePaymentInput } from "../validators/paymentValidator.js";
import { initializePaymentService, verifyPaymentService } from "../services/paymentService.js";

export const initializePayment = async (req, res) => {
  try {
    console.log("Received request body:", req.body);

    const error = validatePaymentInput(req.body);
    if (error) {
      console.log("Validation failed:", error);
      return res.status(400).json({ message: error });
    }

    console.log("Calling payment service to initialize...");
    const data = await initializePaymentService(req.body);

    console.log("Payment initialized:", data);
    res.status(200).json(data);
  } catch (error) {
    console.error("Payment initialization error:", error.response ? error.response.data : error.message);
    res.status(500).json({ message: error.response ? error.response.data : error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { tx_ref } = req.params;
    if (!tx_ref) return res.status(400).json({ message: "tx_ref is required" });

    console.log("Calling payment service to verify...");
    const payment = await verifyPaymentService(tx_ref);

    if (!payment) {
      console.log("Payment verification failed or not successful");
      return res.status(400).json({ success: false, message: "Payment not successful" });
    }

    console.log("Payment verified and saved:", payment);
    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    console.error("Payment verification error:", error.response ? error.response.data : error.message);
    res.status(500).json({ message: error.response ? error.response.data : error.message });
  }
};
