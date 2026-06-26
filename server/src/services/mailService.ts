import nodemailer from "nodemailer";
import { env } from "../config/env";

const transporter = nodemailer.createTransport({
  host: env.smtp.host,
  port: env.smtp.port,
  secure: env.smtp.port === 465,
  auth: env.smtp.user ? { user: env.smtp.user, pass: env.smtp.pass } : undefined,
});

export async function sendAcknowledgmentEmail(to: string, reportRef: string) {
  if (!env.smtp.host) return;
  await transporter.sendMail({
    from: env.smtp.from,
    to,
    subject: `Report Received — ${reportRef}`,
    text: `Your report has been received. Your tracking ID is ${reportRef}. Use this ID at the portal to track status. Your identity remains protected.`,
  });
}

export async function sendStatusUpdateEmail(to: string, reportRef: string, status: string) {
  if (!env.smtp.host) return;
  await transporter.sendMail({
    from: env.smtp.from,
    to,
    subject: `Update on Report ${reportRef}`,
    text: `Your report ${reportRef} status has changed to: ${status}.`,
  });
}
