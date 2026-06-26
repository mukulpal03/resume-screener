import Redis, { RedisOptions } from 'ioredis';
import { env } from '../config/env';

const REDIS_URL = env.REDIS_URL;

function buildRedisOptions(): RedisOptions {
  const isTLS = REDIS_URL.startsWith('rediss://');
  return {
    maxRetriesPerRequest: null, // required by BullMQ
    enableReadyCheck: false, // required by BullMQ
    lazyConnect: false,
    ...(isTLS && { tls: { rejectUnauthorized: false } }),
  };
}

// BullMQ v5 has its own internal ioredis. Passing a pre-built Redis instance
// causes a type mismatch when your ioredis version differs. Pass a plain
// options object instead so BullMQ constructs the connection itself.
export function getBullMQConnection() {
  const isTLS = REDIS_URL.startsWith('rediss://');
  return {
    url: REDIS_URL,
    maxRetriesPerRequest: null as null,
    enableReadyCheck: false,
    ...(isTLS && { tls: { rejectUnauthorized: false } }),
  };
}

// Each BullMQ role (Queue, Worker, pub/sub) needs its own connection — never share.
export function createRedisConnection(): Redis {
  const client = new Redis(REDIS_URL, buildRedisOptions());
  client.on('error', (err) => console.error('[Redis] error:', err.message));
  return client;
}

export const redisPublisher = createRedisConnection();
