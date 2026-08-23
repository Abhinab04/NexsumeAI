import nodemailer from "nodemailer";
import { env } from "@/common/utils/env";
import { magicLinkEmailTemplate } from "./emailTemplates";
import { logger } from "@/server";
import SendmailTransport from "nodemailer/lib/sendmail-transport";
import SMTPTransport from "nodemailer/lib/smtp-transport";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: env.EMAIL,
    pass: env.EMAIL_PASSWORD,
  },
});

export const sendLoginTokenEmail = async (
  email: string,
  userAgent: string,
  token: string,
): Promise<SMTPTransport.SentMessageInfo["messageId"] | null> => {
  try {
    const maigcLink = `${env.SERVER_URL}/auth/login/verify/${token}`;
    const info = await transporter.sendMail({
      from: '"Nexsume.ai" <noreply@nexsume.com>',
      to: email,
      subject: "Magic Link",
      html: magicLinkEmailTemplate(maigcLink, userAgent),
    });
    logger.info(`Message send: ${info.messageId}`);
    logger.info(`Magic: ${maigcLink}`);

    return info.messageId;
  } catch (err) {
    console.log("Error: ", err);
    logger.error(`Failed to send email: ${(err as Error).message}`);
    return null;
  }
};
