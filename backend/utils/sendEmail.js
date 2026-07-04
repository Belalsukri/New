import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    // Create a transporter using SMTP credentials from .env
    const transporter = nodemailer.createTransport({
        service: 'gmail', // You can change this or use host/port for other providers
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    const message = {
        from: `Now E-Commerce <${process.env.SMTP_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    const info = await transporter.sendMail(message);

    console.log('Message sent: %s', info.messageId);
};

export default sendEmail;
