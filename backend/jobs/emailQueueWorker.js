const { Worker } = require('bullmq');
const { sendEmail } = require('../utils/emailService');
const { EMAIL_QUEUE_NAME, queueConnection, isQueueEnabled, markQueueHealthy } = require('../config/queue');

let emailWorkerInstance = null;
let workerFailureCount = 0;

const startEmailWorker = () => {
    if (!isQueueEnabled() || !queueConnection || emailWorkerInstance) {
        return emailWorkerInstance;
    }

    try {
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

        emailWorkerInstance.on('ready', () => {
            console.log('[Queue] Email worker connected and ready');
            markQueueHealthy(true);
            workerFailureCount = 0;
        });

        emailWorkerInstance.on('error', (error) => {
            workerFailureCount++;
            if (workerFailureCount === 1) {
                console.warn('[Queue] Email worker connection error:', error.message);
            } else if (workerFailureCount === 3) {
                console.warn('[Queue] Email worker stopped reconnecting. All emails will be sent directly via Resend/Nodemailer.');
                markQueueHealthy(false);
            }
        });

        emailWorkerInstance.on('failed', (job, error) => {
            console.error(`[Queue] Email job failed (${job?.id || 'unknown'}):`, error.message);
        });

        console.log('[Queue] Email worker initialized');
        return emailWorkerInstance;
    } catch (err) {
        console.warn('[Queue] Could not start email worker:', err.message);
        markQueueHealthy(false);
        return null;
    }
};

module.exports = { startEmailWorker };
