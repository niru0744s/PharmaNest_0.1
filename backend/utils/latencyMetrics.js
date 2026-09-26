const DEFAULT_WINDOW_SIZE = 500;

const createStore = () => ({
  totalMs: [],
  aiCallMs: [],
  productQueryMs: [],
  chatSaveMs: [],
  cacheLookupMs: [],
  firstTokenMs: [],
  successCount: 0,
  failureCount: 0,
  totalRequests: 0,
  cacheHitCount: 0,
  cacheMissCount: 0
});

const store = createStore();

const appendWithCap = (arr, value, cap = DEFAULT_WINDOW_SIZE) => {
  arr.push(value);
  if (arr.length > cap) {
    arr.shift();
  }
};

const percentile = (arr, p) => {
  if (!arr.length) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1);
  return sorted[idx];
};

const average = (arr) => {
  if (!arr.length) return 0;
  return arr.reduce((sum, n) => sum + n, 0) / arr.length;
};

const round = (n) => Number(n.toFixed(2));
const numberOrZero = (n) => (Number.isFinite(n) ? n : 0);

const recordAiLatency = (sample) => {
  store.totalRequests += 1;
  if (sample.success) {
    store.successCount += 1;
  } else {
    store.failureCount += 1;
  }

  if (sample.cacheHit) {
    store.cacheHitCount += 1;
  } else {
    store.cacheMissCount += 1;
  }

  appendWithCap(store.totalMs, numberOrZero(sample.totalMs));
  appendWithCap(store.aiCallMs, numberOrZero(sample.aiCallMs));
  appendWithCap(store.productQueryMs, numberOrZero(sample.productQueryMs));
  appendWithCap(store.chatSaveMs, numberOrZero(sample.chatSaveMs));
  appendWithCap(store.cacheLookupMs, numberOrZero(sample.cacheLookupMs));
  appendWithCap(store.firstTokenMs, numberOrZero(sample.firstTokenMs));
};

const getAiLatencySummary = () => {
  const sampleSize = store.totalMs.length;
  const hitRate = store.totalRequests ? (store.cacheHitCount / store.totalRequests) * 100 : 0;
  return {
    sampleSize,
    totalRequests: store.totalRequests,
    successCount: store.successCount,
    failureCount: store.failureCount,
    cacheHitCount: store.cacheHitCount,
    cacheMissCount: store.cacheMissCount,
    cacheHitRatePercent: round(hitRate),
    totalMs: {
      avg: round(average(store.totalMs)),
      p50: round(percentile(store.totalMs, 50)),
      p95: round(percentile(store.totalMs, 95)),
      p99: round(percentile(store.totalMs, 99))
    },
    aiCallMs: {
      avg: round(average(store.aiCallMs)),
      p50: round(percentile(store.aiCallMs, 50)),
      p95: round(percentile(store.aiCallMs, 95)),
      p99: round(percentile(store.aiCallMs, 99))
    },
    productQueryMs: {
      avg: round(average(store.productQueryMs)),
      p95: round(percentile(store.productQueryMs, 95))
    },
    chatSaveMs: {
      avg: round(average(store.chatSaveMs)),
      p95: round(percentile(store.chatSaveMs, 95))
    },
    cacheLookupMs: {
      avg: round(average(store.cacheLookupMs)),
      p95: round(percentile(store.cacheLookupMs, 95))
    },
    firstTokenMs: {
      avg: round(average(store.firstTokenMs)),
      p95: round(percentile(store.firstTokenMs, 95))
    }
  };
};

module.exports = {
  recordAiLatency,
  getAiLatencySummary
};
