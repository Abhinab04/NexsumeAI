import express, { type Router, type Request, type Response } from "express";
import nodemailer from "nodemailer";

export const contactRouter: Router = express.Router();

contactRouter.post("/contact", async (req: Request, res: Response) => {
    try {
        const { email, message } = req.body;

        if (!email || !message) {
            return res.status(400).json({ success: false, message: "Email and message are required." });
        }

        // Configure nodemailer with Gmail App Password
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // The email is sent TO the owner's email address (EMAIL_USER)
        // The sender claims to be the user who filled out the form
        const mailOptions = {
            from: email,
            to: process.env.EMAIL_USER,
            subject: `New Nexsume.ai Contact Request from ${email}`,
            text: `You have received a new contact message:\n\nFrom: ${email}\n\nMessage:\n${message}`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ success: true, message: "Message sent successfully" });
    } catch (error) {
        console.error("========== CONTACT FORM ERROR ==========");
        console.error(error);
        console.error("========================================");
        res.status(500).json({ success: false, message: "Failed to send email. Please check server configuration." });
    }
});
