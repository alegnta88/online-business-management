
export const validatePaymentInput = ({ amount, email, first_name, last_name, tx_ref }) => {
  if (!amount || !email || !first_name || !last_name || !tx_ref) {
    return "All fields are required: amount, email, first_name, last_name, tx_ref";
  }

  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) return "Invalid email format";

  return null;
};