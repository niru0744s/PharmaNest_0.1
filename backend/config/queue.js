const { Queue } = require('bullmq');

const EMAIL_QUEUE_NAME = 'email-notifications';

const buildQueueConnection = () => {
    if (!process.env.REDIS_URL) return null;

    try {
        const parsed = new URL(process.env.REDIS_URL);
        const connection = {
            host: parsed.hostname,
            port: Number(parsed.port) || 6379,
            maxRetriesPerRequest: null
        };

        if (parsed.username) {
            connection.username = decodeURIComponent(parsed.username);
        }
        if (parsed.password) {
            connection.password = decodeURIComponent(parsed.password);
        }
        if (parsed.protocol === 'rediss:') {
            connection.tls = {};
        }
        if (parsed.pathname && parsed.pathname !== '/') {
            const db = Number(parsed.pathname.slice(1));
            if (!Number.isNaN(db)) {
                connection.db = db;
            }
        }

        return connection;
    } catch (error) {
        console.error('[Queue] Invalid REDIS_URL:', error.message);
        return null;
    }
};

const queueConnection = buildQueueConnection();

const isQueueEnabled = () => Boolean(queueConnection);

const emailQueue = isQueueEnabled()
    ? new Queue(EMAIL_QUEUE_NAME, { connection: queueConnection })
    : null;

if (!isQueueEnabled()) {
    console.warn('[Queue] Redis queue disabled. Falling back to direct email sending.');
}

module.exports = {
    EMAIL_QUEUE_NAME,
    queueConnection,
    emailQueue,
    isQueueEnabled
};
