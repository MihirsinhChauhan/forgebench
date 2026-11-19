import { Queue, RedisConnection, createNodeRedisClient } from 'bullmq';
import { createClient } from 'redis';

RedisConnection.clientFactory = opts => {
  const rawClient = createClient({
    socket: {
      host: opts.host,
      port: opts.port,
    },
    username: opts.username,
    password: opts.password,
    database: opts.db,
  });

  return createNodeRedisClient(rawClient);
};

export const queue = new Queue('queue-fundamentals', {
  connection: {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: Number(process.env.REDIS_PORT ?? 6379),
  },
});