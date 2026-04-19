const Redis = require('ioredis');

let redisClient = null;

if (process.env.REDIS_URL) {
    redisClient = new Redis(process.env.REDIS_URL, {
        maxRetriesPerRequest: 1,
        lazyConnect: true,
        enableReadyCheck: true
    });

    redisClient.on('error', (error) => {
        console.error('[Redis] Connection error:', error.message);
    });

    redisClient.connect().then(()=>console.log("Redis is connected.")).catch((error) => {
        console.error('[Redis] Initial connect failed:', error.message);
    });
} else {
    console.warn('[Redis] REDIS_URL not configured. API caching is disabled.');
}

const isRedisEnabled = () => {
    return Boolean(redisClient) && redisClient.status === 'ready';
};

module.exports = { redisClient, isRedisEnabled };
