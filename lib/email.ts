import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";

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

async function createEmailLog(input: {
  to: string;
  from: string;
  replyTo?: string;
  subject: string;
  body: string;
  status: "SENT" | "FAILED" | "SKIPPED";
  reason?: string;
  error?: string;
}) {
  try {
    await prisma.emailLog.create({
      data: {
        to: input.to,
        from: input.from,
        replyTo: input.replyTo || null,
        subject: input.subject,
        body: input.body,
        status: input.status,
        reason: input.reason || null,
        error: input.error || null
      }
    });
  } catch (error) {
    console.error("EMAIL LOG FAILED", error);
  }
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

    await createEmailLog({
      to: input.to,
      from,
      replyTo: input.replyTo,
      subject: input.subject,
      body: input.text,
      status: "SKIPPED",
      reason: "SMTP_NOT_CONFIGURED"
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

  try {
    await transporter.sendMail({
      from,
      to: input.to,
      replyTo: input.replyTo,
      subject: input.subject,
      text: input.text
    });

    await createEmailLog({
      to: input.to,
      from,
      replyTo: input.replyTo,
      subject: input.subject,
      body: input.text,
      status: "SENT"
    });

    return {
      sent: true
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown email error";

    await createEmailLog({
      to: input.to,
      from,
      replyTo: input.replyTo,
      subject: input.subject,
      body: input.text,
      status: "FAILED",
      error: message
    });

    throw error;
  }
}

export function getAdminEmail() {
  return getEnv("ADMIN_EMAIL") || "gianig@gmail.com";
}

export function getPublicEmail() {
  return getEnv("PUBLIC_CONTACT_EMAIL") || "contact@pentrunoi.ro";
}
