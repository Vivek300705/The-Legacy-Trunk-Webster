import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_APP_PASSWORD:", process.env.EMAIL_APP_PASSWORD);

const testEmail = async () => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "vivekkumarsulaniya@gmail.com", // Change this
      subject: "Test Email",
      text: "If you receive this, email is working!",
    });
    console.log("✅ Email sent:", info.messageId);
  } catch (error) {
    console.error("❌ Error:", error);
  }
};

testEmail();
