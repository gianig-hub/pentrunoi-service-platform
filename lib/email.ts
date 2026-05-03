import nodemailer from "nodemailer";

type SendEmailInput = {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
};

function getEnv(name: string) {
  return process.env[name]?.trim() || "";
}

function isSmtpConfigured() {
  return Boolean(
    getEnv("SMTP_HOST") &&
      getEnv("SMTP_PORT") &&
      getEnv("SMTP_USER") &&
      getEnv("SMTP_PASSWORD")
  );
}

export async function sendEmail(input: SendEmailInput) {
  const from =
    getEnv("SMTP_FROM") ||
    getEnv("PUBLIC_CONTACT_EMAIL") ||
    "contact@pentrunoi.ro";

  if (!isSmtpConfigured()) {
    console.log("EMAIL NOT SENT - SMTP NOT CONFIGURED");
    console.log({
      to: input.to,
      from,
      replyTo: input.replyTo,
      subject: input.subject,
      text: input.text
    });

    return {
      sent: false,
      reason: "SMTP_NOT_CONFIGURED"
    };
  }

  const port = Number(getEnv("SMTP_PORT"));
  const secure = port === 465;

  const transporter = nodemailer.createTransport({
    host: getEnv("SMTP_HOST"),
    port,
    secure,
    auth: {
      user: getEnv("SMTP_USER"),
      pass: getEnv("SMTP_PASSWORD")
    }
  });

  await transporter.sendMail({
    from,
    to: input.to,
    replyTo: input.replyTo,
    subject: input.subject,
    text: input.text
  });

  return {
    sent: true
  };
}

export function getAdminEmail() {
  return getEnv("ADMIN_EMAIL") || "gianig@gmail.com";
}

export function getPublicEmail() {
  return getEnv("PUBLIC_CONTACT_EMAIL") || "contact@pentrunoi.ro";
}
