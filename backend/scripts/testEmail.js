require('dotenv').config();
const nodemailer = require('nodemailer');

const testSMTP = async () => {
    console.log('--- SMTP Diagnostic Tool ---');
    console.log('Environment Variables:');
    console.log('EMAIL:', process.env.EMAIL ? 'SET' : 'MISSING');
    console.log('APP_PASS:', process.env.APP_PASS ? 'SET' : 'MISSING');

    if (!process.env.EMAIL || !process.env.APP_PASS) {
        console.error('Missing configuration. Please check .env file.');
        return;
    }

    const configs = [
        {
            name: 'Gmail with service: "gmail"',
            service: 'gmail',
        },
        {
            name: 'Gmail Port 587 (STARTTLS)',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
        },
        {
            name: 'Gmail Port 465 (SSL)',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
        }
    ];

    for (const config of configs) {
        console.log(`\nTesting Config: ${config.name}`);
        if (config.service) {
            console.log(`Using NodeMailer built-in service: "${config.service}"`);
        } else {
            console.log(`Connecting to ${config.host}:${config.port} (secure: ${config.secure})...`);
        }

        const transporter = nodemailer.createTransport({
            ...config,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.APP_PASS,
            },
            connectionTimeout: 15000,
        });

        try {
            const start = Date.now();
            await transporter.verify();
            const end = Date.now();
            console.log(`✅ Success! Verification took ${end - start}ms`);
        } catch (error) {
            console.error(`❌ Failed: ${error.message}`);
            if (error.code) console.error(`Code: ${error.code}`);
        }
    }
};

testSMTP();
