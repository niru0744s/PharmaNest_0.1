const { redisClient, isRedisEnabled } = require('../config/redis');

const parseCacheValue = (value) => {
    try {
        return JSON.parse(value);
    } catch (error) {
        return null;
    }
};

const getCache = async (key) => {
    if (!isRedisEnabled()) return null;

    const value = await redisClient.get(key);
    if (!value) return null;

    return parseCacheValue(value);
};

const acquireLock = async (lockKey, ttlSeconds = 8) => {
    if (!isRedisEnabled()) return false;
    if (!Number.isInteger(ttlSeconds) || ttlSeconds <= 0) return false;

    const result = await redisClient.set(lockKey, '1', 'NX', 'EX', ttlSeconds);
    return result === 'OK';
};

const releaseLock = async (lockKey) => {
    if (!isRedisEnabled()) return;
    await redisClient.del(lockKey);
};

const setCache = async (key, value, ttlSeconds) => {
    if (!isRedisEnabled()) return;
    if (!Number.isInteger(ttlSeconds) || ttlSeconds <= 0) return;

    await redisClient.set(key, JSON.stringify(value), 'EX', ttlSeconds);
};

const delCache = async (key) => {
    if (!isRedisEnabled()) return;
    await redisClient.del(key);
};

const invalidateByPrefix = async (prefix) => {
    if (!isRedisEnabled()) return;

    let cursor = '0';
    do {
        const [nextCursor, keys] = await redisClient.scan(
            cursor,
            'MATCH',
            `${prefix}*`,
            'COUNT',
            100
        );

        if (keys.length > 0) {
            await redisClient.del(...keys);
        }

        cursor = nextCursor;
    } while (cursor !== '0');
};

const invalidateMany = async ({ keys = [], prefixes = [] } = {}) => {
    if (!isRedisEnabled()) return;

    if (keys.length > 0) {
        await redisClient.del(...keys);
    }

    if (prefixes.length > 0) {
        await Promise.all(prefixes.map((prefix) => invalidateByPrefix(prefix)));
    }
};

module.exports = {
    getCache,
    setCache,
    acquireLock,
    releaseLock,
    delCache,
    invalidateByPrefix,
    invalidateMany
};
