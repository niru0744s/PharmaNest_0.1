require('dotenv').config();
const { Resend } = require('resend');

const testResend = async () => {
    console.log('--- Resend Diagnostic Tool ---');
    console.log('Environment Variables:');
    console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'SET' : 'MISSING');
    console.log('EMAIL:', process.env.EMAIL ? 'SET' : 'MISSING');

    if (!process.env.RESEND_API_KEY || !process.env.EMAIL) {
        console.error('Missing RESEND_API_KEY or EMAIL. Please check .env file.');
        return;
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
        console.log('\nAttempting to send test email via Resend HTTP API...');
        const start = Date.now();

        // Use Resend's default testing domain
        const fromEmail = 'onboarding@resend.dev';

        const { data, error } = await resend.emails.send({
            from: fromEmail,
            to: 'niruk792@gmail.com', // Resend sandbox requirement: only send to your own registered email
            subject: 'PharmaNest - Resend Test',
            html: '<strong>Resend is working!</strong> This test was sent using the Resend HTTP API.',
        });

        const end = Date.now();

        if (error) {
            console.error('❌ Failed:', error.message);
            return;
        }

        console.log(`✅ Success! Email sent in ${end - start}ms`);
        console.log('Data:', data);
    } catch (error) {
        console.error(`❌ Fatal Error: ${error.message}`);
    }
};

testResend();
