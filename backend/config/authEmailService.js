import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER || process.env.EMAIL_USER,
    pass: process.env.MAIL_PASS || process.env.EMAIL_PASS,
  },
});

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// Send verification email
export const verifyEmail = async (token, email) => {
  const verifyUrl = `${FRONTEND_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: `"ForEver" <${process.env.MAIL_USER || process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your email address",
    text: `Please verify your email address by clicking the link below:\n\n${verifyUrl}\n\nIf you did not request this, ignore the email.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent to", email);
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};

// Send OTP for password reset
export const sendOTPEmail = async (otp, email) => {
  const mailOptions = {
    from: `"ForEver" <${process.env.MAIL_USER || process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your password reset OTP",
    text: `Your OTP is: ${otp}\n\nValid for 10 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("OTP email sent to", email);
  } catch (error) {
    console.error("Error sending OTP email:", error);
  }
};
