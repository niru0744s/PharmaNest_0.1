const { getCache, setCache, acquireLock, releaseLock } = require('./cache');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getOrSetCacheWithStale = async ({
    key,
    ttlSeconds,
    staleTtlSeconds,
    lockTtlSeconds = 8,
    waitForFreshMs = 80,
    compute
}) => {
    const staleKey = `${key}:stale`;
    const lockKey = `lock:${key}`;

    const fresh = await getCache(key);
    if (fresh) return fresh;

    const hasLock = await acquireLock(lockKey, lockTtlSeconds);
    if (!hasLock) {
        const stale = await getCache(staleKey);
        if (stale) return stale;

        await sleep(waitForFreshMs);
        const retriedFresh = await getCache(key);
        if (retriedFresh) return retriedFresh;
    }

    let computed;
    try {
        computed = await compute();
    } finally {
        if (hasLock) {
            await releaseLock(lockKey);
        }
    }

    const effectiveStaleTtl = Number.isInteger(staleTtlSeconds) && staleTtlSeconds > ttlSeconds
        ? staleTtlSeconds
        : ttlSeconds * 3;

    await Promise.all([
        setCache(key, computed, ttlSeconds),
        setCache(staleKey, computed, effectiveStaleTtl)
    ]);

    return computed;
};

module.exports = { getOrSetCacheWithStale };
