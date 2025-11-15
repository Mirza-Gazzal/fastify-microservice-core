const fp = require('fastify-plugin');
const Redis = require('ioredis');

async function redisPlugin(fastify, opts) {
    const redis = new Redis({
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASS || undefined,

    });

    redis.on('connect', () => _sys.logger.log('✅ Redis connected'));
    redis.on('error', (err) => _sys.logger.log('❌ Redis error:', err));

    fastify.decorate('redis', redis);
}

module.exports = fp(redisPlugin);