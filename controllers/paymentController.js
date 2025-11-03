import { validatePaymentInput } from "../validators/paymentValidator.js";
import { initializePaymentService, verifyPaymentService } from "../services/paymentService.js";

export const initializePayment = async (req, res) => {
  try {

    const error = validatePaymentInput(req.body);
    if (error) {
      return res.status(400).json({ message: error });
    }

    const data = await initializePaymentService(req.body);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.response ? error.response.data : error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { tx_ref } = req.params;
    if (!tx_ref) return res.status(400).json({ message: "tx_ref is required" });

    const payment = await verifyPaymentService(tx_ref);

    if (!payment) {
      return res.status(400).json({ success: false, message: "Payment not successful" });
    }

    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ message: error.response ? error.response.data : error.message });
  }
};
