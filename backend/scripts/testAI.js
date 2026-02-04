const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
require('dotenv').config();

async function testAI() {
    const message = "I have a headache, what is available?";

    // We need a valid JWT if the route is protected
    // According to App.tsx and app.js, /api/v1/ai seems to be protected (requires req.user)
    // However, I can't easily get a token without loggin in. 
    // Let me check if I can bypass auth for this test or find a way to get a token.

    console.log("Testing AI Advisor with message:", message);
}

testAI();
