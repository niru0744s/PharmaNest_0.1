const { emailQueue, isQueueEnabled } = require('../config/queue');
const { sendEmail } = require('./emailService');

const queueEmail = async ({ to, subject, html }) => {
    if (!isQueueEnabled() || !emailQueue) {
        await sendEmail({ to, subject, html });
        return { queued: false };
    }

    try {
        await emailQueue.add(
            'send-email',
            { to, subject, html },
            {
                attempts: 3,
                backoff: { type: 'exponential', delay: 2000 },
                removeOnComplete: 200,
                removeOnFail: 500
            }
        );
        return { queued: true };
    } catch (error) {
        console.error('[Queue] Email enqueue failed, sending directly:', error.message);
        await sendEmail({ to, subject, html });
        return { queued: false };
    }
};

module.exports = { queueEmail };
