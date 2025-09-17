const redis = require('redis');
const logger = require('../utils/logger');

const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
});

redisClient.on('error', (err) => {
  logger.error('Redis error:', err);
});

redisClient.on('connect', () => {
  logger.info('Connected to Redis');
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    logger.error('Redis connection error:', err);
    process.exit(1);
  }
};

module.exports = { redisClient, connectRedis };