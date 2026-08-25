import nodemailer from "nodemailer";
import { env } from "./env.js";
import { magicLinkEmailTemplate } from "./emailTemplates.js";
import { logger } from "../../server.js";
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
    const magicLink =
      `${env.SERVER_URL}/auth/login/verify/${token}`;

    const info = await transporter.sendMail({
      from: '"Nexsume.ai" <noreply@nexsume.com>',
      to: email,
      subject: "Magic Link",
      html: magicLinkEmailTemplate(
        magicLink,
        userAgent,
      ),
    });

    logger.info(`Message sent: ${info.messageId}`);
    logger.info(`Magic link: ${magicLink}`);

    return info.messageId;
  } catch (err) {
    console.error("Error:", err);

    logger.error(
      `Failed to send email: ${
        (err as Error).message
      }`,
    );

    return null;
  }
};
