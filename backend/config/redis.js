import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

let redis = null;
let isConnected = false;

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

function createRedisClient() {
  if (redis) return redis;

  try {
    redis = new Redis(REDIS_URL, {
      maxRetriesPerRequest: 3,
      retryDelayOnFailover: 100,
      enableReadyCheck: true,
    });

    redis.on('connect', () => {
      console.log('🔴 Redis: Connecting...');
    });

    redis.on('ready', () => {
      isConnected = true;
      console.log('✅ Redis: Connected and ready');
    });

    redis.on('error', (err) => {
      isConnected = false;
      console.error('❌ Redis Error:', err.message);
    });

    redis.on('close', () => {
      isConnected = false;
      console.log('🔴 Redis: Connection closed');
    });

    redis.on('reconnecting', () => {
      console.log('🔄 Redis: Reconnecting...');
    });

    return redis;
  } catch (error) {
    console.error('❌ Redis: Failed to create client:', error.message);
    return null;
  }
}

function getRedisClient() {
  if (!redis) {
    return createRedisClient();
  }
  return redis;
}

function isRedisConnected() {
  return isConnected && redis !== null;
}

async function closeRedisConnection() {
  if (redis) {
    await redis.quit();
    redis = null;
    isConnected = false;
    console.log('🔴 Redis: Connection closed gracefully');
  }
}

export { getRedisClient, isRedisConnected, closeRedisConnection };
export default getRedisClient;