const { Worker } = require('bullmq');
const { sendEmail } = require('../utils/emailService');
const { EMAIL_QUEUE_NAME, queueConnection, isQueueEnabled } = require('../config/queue');

let emailWorkerInstance = null;

const startEmailWorker = () => {
    if (!isQueueEnabled() || !queueConnection || emailWorkerInstance) {
        return emailWorkerInstance;
    }

    emailWorkerInstance = new Worker(
        EMAIL_QUEUE_NAME,
        async (job) => {
            await sendEmail(job.data);
        },
        {
            connection: queueConnection,
            concurrency: Number(process.env.EMAIL_QUEUE_CONCURRENCY) || 5
        }
    );

    emailWorkerInstance.on('error', (error) => {
        console.error('[Queue] Email worker error:', error.message);
    });

    emailWorkerInstance.on('failed', (job, error) => {
        console.error(`[Queue] Email job failed (${job?.id || 'unknown'}):`, error.message);
    });

    console.log('[Queue] Email worker started');
    return emailWorkerInstance;
};

module.exports = { startEmailWorker };
