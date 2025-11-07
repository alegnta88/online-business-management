import nodemailer from 'nodemailer';

export const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,        
      port: process.env.EMAIL_PORT || 587, 
      secure: false,                        
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: `"Admin OTP" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    console.log('Email sent: %s', info.messageId);
    return true;
  } catch (err) {
    console.error('Email send error:', err);
    return false;
  }
};