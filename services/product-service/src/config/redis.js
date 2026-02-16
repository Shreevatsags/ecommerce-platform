const Redis = require('ioredis');

// Create Redis client
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
});

// Connection events
redis.on('connect', () => {
  console.log('✅ Redis connected');
});

redis.on('ready', () => {
  console.log('🚀 Redis ready to use');
});

redis.on('error', (err) => {
  console.error('❌ Redis error:', err);
});

redis.on('close', () => {
  console.log('⚠️ Redis connection closed');
});

// Helper function to get cached data
async function getCache(key) {
  try {
    const data = await redis.get(key);
    if (data) {
      console.log(`📦 Cache HIT for key: ${key}`);
      return JSON.parse(data);
    }
    console.log(`❌ Cache MISS for key: ${key}`);
    return null;
  } catch (error) {
    console.error('Error reading from cache:', error);
    return null;
  }
}

// Helper function to set cached data
async function setCache(key, data, expirationInSeconds = 300) {
  try {
    await redis.setex(key, expirationInSeconds, JSON.stringify(data));
    console.log(`✅ Cached key: ${key} (expires in ${expirationInSeconds}s)`);
    return true;
  } catch (error) {
    console.error('Error writing to cache:', error);
    return false;
  }
}

// Helper function to delete cached data
async function deleteCache(key) {
  try {
    await redis.del(key);
    console.log(`🗑️ Deleted cache key: ${key}`);
    return true;
  } catch (error) {
    console.error('Error deleting from cache:', error);
    return false;
  }
}

// Helper function to delete multiple keys matching a pattern
async function deleteCachePattern(pattern) {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
      console.log(`🗑️ Deleted ${keys.length} cache keys matching: ${pattern}`);
    }
    return true;
  } catch (error) {
    console.error('Error deleting cache pattern:', error);
    return false;
  }
}

module.exports = {
  redis,
  getCache,
  setCache,
  deleteCache,
  deleteCachePattern
};