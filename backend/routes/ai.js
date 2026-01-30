const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { userMiddleware } = require('../middleware/tokenVerify');

router.post('/chat', userMiddleware, aiController.getAIAdvice);
router.get('/history', userMiddleware, aiController.getChatHistory);

module.exports = router;
