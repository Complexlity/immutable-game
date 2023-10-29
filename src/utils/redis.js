import Redis, { RedisOptions } from 'ioredis'

export function createRedisInstance(){
  const config = {
  host: process.env.NEXT_PUBLIC_REDIS_HOST,
    password: process.env.NEXT_PUBLIC_REDIS_PASSWORD,
    port: process.env.NEXT_PUBLIC_REDIS_PORT,
  }
  try {
    const options = {
      host: config.host,
      lazyConnect: true,
      showFriendlyErrorStack: true,
      enableAutoPipelining: true,
      maxRetriesPerRequest: 0,
      retryStrategy: (times) => {
        if (times > 3) {
          throw new Error(`[Redis] Could not connect after ${times} attempts`);
        }

        return Math.min(times * 200, 1000);
      },
    };

    if (config.port) {
      options.port = config.port;
    }

    if (config.password) {
      options.password = config.password;
    }

    const redis = new Redis(options);

    redis.on('error', (error) => {
      console.warn('[Redis] Error connecting', error);
    });

    return redis;
  } catch (e) {
    throw new Error(`[Redis] Could not create a Redis instance`);
  }
}