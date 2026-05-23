type SendEmailInput = {
  html?: string;
  subject: string;
  text: string;
  to: string;
};

export async function sendEmail({ html, subject, text, to }: SendEmailInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !fromEmail) {
    return { reason: "Email service is not configured.", sent: false };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      body: JSON.stringify({
        from: `Finance Career Edge <${fromEmail}>`,
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
  } catch {
    return { reason: "Email could not be sent.", sent: false };
  }
}
