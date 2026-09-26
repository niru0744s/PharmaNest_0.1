const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { userMiddleware } = require('../middleware/tokenVerify');

router.post('/chat', userMiddleware, aiController.getAIAdvice);
router.post('/chat/stream', userMiddleware, aiController.getAIAdviceStream);
router.get('/history', userMiddleware, aiController.getChatHistory);
router.get('/latency', userMiddleware, aiController.getAILatencyStats);

module.exports = router;
