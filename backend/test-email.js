import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const run = async () => {
    try {
        const info = await transporter.sendMail({
            from: `Test <${process.env.SMTP_USER}>`,
            to: process.env.SMTP_USER,
            subject: 'Test Email',
            text: 'This is a test email.',
        });
        console.log('Message sent successfully:', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

run();
