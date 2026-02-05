require('dotenv').config();
const { Resend } = require('resend');

const testResend = async () => {
    console.log('--- Resend Diagnostic Tool ---');
    console.log('Environment Variables:');
    console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'SET' : 'MISSING');

    if (!process.env.RESEND_API_KEY) {
        console.error('Missing RESEND_API_KEY. Please check .env file.');
        return;
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
        console.log('\nAttempting to send test email via Resend HTTP API...');
        const start = Date.now();

        const { data, error } = await resend.emails.send({
            from: 'PharmaNest <onboarding@resend.dev>',
            to: 'niruk792@gmail.com', // Using the email from the logs
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
