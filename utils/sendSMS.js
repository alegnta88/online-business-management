import axios from "axios";

export const sendSMS = async (phone, message) => {
  try {
    const response = await axios.post(process.env.SMS_API_URL, {
      senderName: process.env.SMS_SENDER_NAME,
      message,
      recipients: [phone],
    }, {
      headers: {
        Authorization: `Bearer ${process.env.SMS_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    console.log(`✅ SMS sent to ${phone}:`, response.data);
    return true;
  } catch (error) {
    console.error(`❌ Failed to send SMS to ${phone}:`, error.message);
    return false;
  }
};