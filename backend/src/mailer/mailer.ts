import nodemailer from "nodemailer";
import {emailAppPass, emailUser, nextAuthUrl} from "../config/config";

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${nextAuthUrl}/verify?token=${token}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUser,
      pass: emailAppPass,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"RTC App" <${emailUser}>`,
      to: email,
      subject: "Verify your email",
      html: `
        <p>Zdravo,</p>
        <p>Kliknite na link ispod da biste verifikovali svoj email:</p>
        <a href="${verificationUrl}" style="color: #2563eb">${verificationUrl}</a>
        <p>Hvala!</p>
      `,
    });

    console.log("Verification email sent:", info);
  } catch (error) {
    console.error("Error sending email via Gmail SMTP:", error);
    throw new Error("Email nije mogao biti poslat.");
  }
}