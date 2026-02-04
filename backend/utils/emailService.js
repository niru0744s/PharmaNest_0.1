const nodemailer = require('nodemailer');

/**
 * Robust email service to handle production SMTP connections.
 * Uses explicit host/port configuration to avoid 'service: gmail' timeouts on cloud hosts like Render.
 */
const sendEmail = async ({ to, subject, html }) => {
    try {
        console.log(`[EmailService] Attempting to send email to: ${to}, Subject: ${subject}`);

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL,
                pass: process.env.APP_PASS,
            },
            // Adding timeouts to prevent long-hanging connections
            connectionTimeout: 10000, // 10 seconds
            greetingTimeout: 5000,    // 5 seconds
            socketTimeout: 15000,     // 15 seconds
        });

        // Verify connection configuration
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
