const { Queue } = require('bullmq');

const EMAIL_QUEUE_NAME = 'email-notifications';

let isQueueHealthy = true;
let queueFailureLogged = false;

const buildQueueConnection = () => {
    if (!process.env.REDIS_URL) return null;

    try {
        const parsed = new URL(process.env.REDIS_URL);
        const connection = {
            host: parsed.hostname,
            port: Number(parsed.port) || 6379,
            maxRetriesPerRequest: null,
            enableOfflineQueue: false, // Don't buffer jobs if Redis is unreachable
            connectTimeout: 5000,
            retryStrategy(times) {
                if (times > 3) {
                    if (!queueFailureLogged) {
                        console.warn('[Queue] Redis connection failed after 3 attempts. Disabling queue; direct email fallback active.');
                        queueFailureLogged = true;
                    }
                    isQueueHealthy = false;
                    return null; // Stop reconnecting to prevent log spam
                }
                return Math.min(times * 1000, 3000);
            }
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

const isQueueEnabled = () => Boolean(queueConnection) && isQueueHealthy;

let emailQueue = null;
if (Boolean(queueConnection)) {
    try {
        emailQueue = new Queue(EMAIL_QUEUE_NAME, { connection: queueConnection });

        emailQueue.on('error', (err) => {
            if (!queueFailureLogged) {
                console.warn('[Queue] Redis queue error:', err.message, '- Falling back to direct email sending.');
                queueFailureLogged = true;
            }
            isQueueHealthy = false;
        });
    } catch (err) {
        console.warn('[Queue] Failed to initialize Queue:', err.message);
        isQueueHealthy = false;
        emailQueue = null;
    }
}

if (!isQueueEnabled()) {
    console.warn('[Queue] Redis queue disabled. Falling back to direct email sending.');
}

const markQueueHealthy = (healthy) => {
    isQueueHealthy = Boolean(healthy);
    if (healthy) queueFailureLogged = false;
};

module.exports = {
    EMAIL_QUEUE_NAME,
    queueConnection,
    emailQueue,
    isQueueEnabled,
    markQueueHealthy
};
