import nodemailer from "nodemailer";

// ==========================================
// SEND EMAIL FUNCTION USING NODEMAILER
// ==========================================
export const sendInvitationEmail = async (
  invitation,
  inviterName,
  circleName
) => {
  // Ensure SMTP credentials are set
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    FROM_EMAIL,
    FRONTEND_URL,
  } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    throw new Error(
      "SMTP environment variables not set (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS)"
    );
  }

  // Build invite link
  const inviteLink = `${
    FRONTEND_URL || "http://localhost:5173"
  }/accept-invitation/${invitation.token}`;

  // Build email HTML
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; background: #f9f9f9; }
        .button { display: inline-block; padding: 15px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>StoryNest</h1>
        <p>Family Stories, Preserved Forever</p>
      </div>
      <div class="content">
        <h2>You've Been Invited!</h2>
        <p>Hello,</p>
        <p><strong>${inviterName}</strong> has invited you to join the family circle <strong>"${circleName}"</strong> on StoryNest.</p>
        <p>Click the button below to accept the invitation and start sharing family stories:</p>
        <center>
          <a href="${inviteLink}" class="button">Accept Invitation</a>
        </center>
        <p style="font-size: 14px; color: #666; margin-top: 20px;">
          Or copy this link: <br>
          <code>${inviteLink}</code>
        </p>
        <p style="font-size: 12px; color: #999; margin-top: 30px;">
          This invitation expires in 7 days.
        </p>
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} StoryNest. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;

  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465, // true for 465, false for other ports
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  // Prepare email data
  const mailOptions = {
    from: FROM_EMAIL || `"StoryNest" <${SMTP_USER}>`,
    to: invitation.email,
    subject: `You're invited to join "${circleName}" on StoryNest`,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);

    if (process.env.NODE_ENV === "development") {
      console.log("✅ Email sent successfully");
      console.log("Message ID:", info.messageId);
      console.log("Sent to:", invitation.email);
    }

    return {
      success: true,
      messageId: info.messageId,
      info,
    };
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    throw error;
  }
};
