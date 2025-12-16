import { getRedisClient, isRedisConnected } from '../config/redis.js';

// Cache keys
const CACHE_KEYS = {
  ALL_ITEMS: 'items:all',
  SINGLE_ITEM: (id) => `items:${id}`,
};

// Default TTL: 5 minutes (in seconds)
const DEFAULT_TTL = 300;

/**
 * Get data from cache
 * @param {string} key - Cache key
 * @returns {Promise<any|null>} - Cached data or null
 */
async function getCache(key) {
  if (!isRedisConnected()) {
    return null;
  }

  try {
    const redis = getRedisClient();
    const data = await redis.get(key);
    
    if (data) {
      console.log(`📦 Cache HIT: ${key}`);
      return JSON.parse(data);
    }
    
    console.log(`📭 Cache MISS: ${key}`);
    return null;
  } catch (error) {
    console.error('❌ Cache get error:', error.message);
    return null;
  }
}

/**
 * Set data in cache
 * @param {string} key - Cache key
 * @param {any} data - Data to cache
 * @param {number} ttl - Time to live in seconds (default: 5 minutes)
 * @returns {Promise<boolean>} - Success status
 */
async function setCache(key, data, ttl = DEFAULT_TTL) {
  if (!isRedisConnected()) {
    return false;
  }

  try {
    const redis = getRedisClient();
    await redis.setex(key, ttl, JSON.stringify(data));
    console.log(`💾 Cache SET: ${key} (TTL: ${ttl}s)`);
    return true;
  } catch (error) {
    console.error('❌ Cache set error:', error.message);
    return false;
  }
}

/**
 * Delete a specific cache key
 * @param {string} key - Cache key to delete
 * @returns {Promise<boolean>} - Success status
 */
async function deleteCache(key) {
  if (!isRedisConnected()) {
    return false;
  }

  try {
    const redis = getRedisClient();
    await redis.del(key);
    console.log(`🗑️ Cache DELETE: ${key}`);
    return true;
  } catch (error) {
    console.error('❌ Cache delete error:', error.message);
    return false;
  }
}

/**
 * Invalidate all items cache (call after create/update/delete)
 * @returns {Promise<boolean>} - Success status
 */
async function invalidateItemsCache() {
  if (!isRedisConnected()) {
    return false;
  }

  try {
    const redis = getRedisClient();
    
    // Delete the all items cache
    await redis.del(CACHE_KEYS.ALL_ITEMS);
    
    // Delete all individual item caches using pattern
    const keys = await redis.keys('items:*');
    if (keys.length > 0) {
      await redis.del(...keys);
    }
    
    console.log(`🗑️ Cache INVALIDATED: All items cache cleared`);
    return true;
  } catch (error) {
    console.error('❌ Cache invalidation error:', error.message);
    return false;
  }
}

/**
 * Get cache statistics
 * @returns {Promise<object>} - Cache stats
 */
async function getCacheStats() {
  if (!isRedisConnected()) {
    return { connected: false };
  }

  try {
    const redis = getRedisClient();
    const info = await redis.info('stats');
    const keys = await redis.keys('items:*');
    
    return {
      connected: true,
      itemsCached: keys.length,
      keys: keys,
    };
  } catch (error) {
    console.error('❌ Cache stats error:', error.message);
    return { connected: false, error: error.message };
  }
}

export {
  CACHE_KEYS,
  DEFAULT_TTL,
  getCache,
  setCache,
  deleteCache,
  invalidateItemsCache,
  getCacheStats,
};
