const nodemailer = require('nodemailer');

/**
 * Robust email service to handle production SMTP connections.
 * Uses explicit host/port configuration to avoid 'service: gmail' timeouts on cloud hosts like Render.
 */
const sendEmail = async ({ to, subject, html }) => {
    try {
        console.log(`[EmailService] Attempting to send email to: ${to}, Subject: ${subject}`);

        if (!process.env.EMAIL || !process.env.APP_PASS) {
            console.error('[EmailService] Missing EMAIL or APP_PASS in environment variables');
            throw new Error('Email configuration missing');
        }

        console.log(`[EmailService] Using email: ${process.env.EMAIL.substring(0, 3)}... and APP_PASS is ${process.env.APP_PASS ? 'READY' : 'MISSING'}`);

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.APP_PASS,
            },
            connectionTimeout: 20000, // 20 seconds
            greetingTimeout: 10000,
            socketTimeout: 20000,
            dnsTimeout: 10000,
        });

        console.log('[EmailService] Verifying SMTP connection (Step 1: Handshake)...');
        await transporter.verify();
        console.log('[EmailService] SMTP connection verified successfully');

        const mailOptions = {
            from: `"PharmaNest" <${process.env.EMAIL}>`,
            to,
            subject,
            html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('[EmailService] Email sent successfully:', info.messageId);
        return info;
    } catch (error) {
        console.error('[EmailService] Fatal Error sending email:');
        console.error('Code:', error.code);
        console.error('Command:', error.command);
        console.error('Message:', error.message);
        if (error.stack) console.error('Stack:', error.stack);
        throw error;
    }
};

module.exports = { sendEmail };
