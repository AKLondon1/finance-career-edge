type SendEmailInput = {
  html?: string;
  subject: string;
  text: string;
  to: string;
};

export async function sendEmail({ html, subject, text, to }: SendEmailInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const supportEmail = process.env.SUPPORT_EMAIL || "support@financecareeredge.com";

  if (!apiKey) {
    return { reason: "Email service is not configured.", sent: false };
  }

  const response = await fetch("https://api.resend.com/emails", {
    body: JSON.stringify({
      from: `Finance Career Edge <${supportEmail}>`,
      html,
      subject,
      text,
      to,
    }),
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    return { reason: "Email could not be sent.", sent: false };
  }

  return { sent: true };
}
