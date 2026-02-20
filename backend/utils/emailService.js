const { Resend } = require('resend');

/**
 * Modern email service using Resend HTTP API.
 * This completely avoids SMTP port-blocking/timeout issues on cloud hosts like Render.
 */
const sendEmail = async ({ to, subject, html }) => {
    try {
        console.log(`[EmailService] Attempting to send email via Resend to: ${to}, Subject: ${subject}`);

        if (!process.env.RESEND_API_KEY) {
            console.error('[EmailService] Missing RESEND_API_KEY in environment variables');
            throw new Error('Email configuration missing');
        }

        const resend = new Resend(process.env.RESEND_API_KEY);

        // Use verified production domain for Resend
        const fromEmail = 'PharmaNest <noreply@interview-ai.fun>';

        const { data, error } = await resend.emails.send({
            from: fromEmail,
            to,
            subject,
            html,
        });

        if (error) {
            console.error('[EmailService] Resend API Error:', error);
            throw error;
        }

        console.log('[EmailService] Email sent successfully via Resend:', data.id);
        return data;
    } catch (error) {
        console.error('[EmailService] Fatal Error sending email:');
        console.error('Message:', error.message);
        if (error.stack) console.error('Stack:', error.stack);
        throw error;
    }
};

module.exports = { sendEmail };
