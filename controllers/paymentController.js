import { validatePaymentInput } from "../validators/paymentValidator.js";
import {
  initializePaymentService,
  verifyPaymentService,
} from "../services/paymentService.js";

export const initializePayment = async (req, res) => {

  try {
  
    const error = validatePaymentInput(req.body);
    if (error) {

      return res.status(400).json({ message: error });
    }

    const data = await initializePaymentService(req.body);

    res.status(200).json(data);
  } catch (error) {
    console.error(
      "🔥 [initializePayment] Payment initialization error:",
      error.response ? error.response.data : error.message
    );
    res
      .status(500)
      .json({ message: error.response ? error.response.data : error.message });
  }
};

export const verifyPayment = async (req, res) => {

  try {
    const { tx_ref } = req.params;

    if (!tx_ref) {
      return res.status(400).json({ message: "tx_ref is required" });
    }
    const payment = await verifyPaymentService(tx_ref);

    if (!payment) {
      return res
        .status(400)
        .json({ success: false, message: "Payment not successful" });
    }
    
    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    console.error(
      "🔥 [verifyPayment] Error verifying payment:",
      error.response ? error.response.data : error.message
    );
    res
      .status(500)
      .json({ message: error.response ? error.response.data : error.message });
  }
};
