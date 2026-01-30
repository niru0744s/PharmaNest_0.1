const express = require('express');
const router = express.Router();
const jwtToken = require('../middleware/tokenVerify');

// Refresh access token using refresh token
router.post('/refresh', async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).send({
                success: 0,
                message: 'Refresh token is required'
            });
        }

        // Generate new tokens
        const tokens = await jwtToken.refreshAccessToken(refreshToken);

        res.send({
            success: 1,
            message: 'Token refreshed successfully',
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
        });
    } catch (error) {
        res.status(401).send({
            success: 0,
            message: error.message || 'Invalid or expired refresh token'
        });
    }
});

// Logout - revoke refresh token
router.post('/logout', async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).send({
                success: 0,
                message: 'Refresh token is required'
            });
        }

        await jwtToken.revokeRefreshToken(refreshToken);

        res.send({
            success: 1,
            message: 'Logged out successfully'
        });
    } catch (error) {
        res.status(500).send({
            success: 0,
            message: error.message || 'Logout failed'
        });
    }
});

module.exports = router;
