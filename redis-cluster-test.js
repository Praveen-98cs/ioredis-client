const Redis = require("ioredis");

console.log("Initializing Redis cluster connection...");

const cluster = new Redis.Cluster([
  {
    host: `redis-cluster.redis.svc.cluster.local`,
    port: 6379,
  },
], {
  redisOptions: {
    password: "redis",  // Make sure this is correct
    connectTimeout: 10000,  // Reduced connect timeout to 10 seconds
  },
  clusterRetryStrategy: (times) => Math.min(times * 100, 3000),
});

cluster.on('connect', () => {
  console.log('Connected to Redis cluster');
});

cluster.on('error', (err) => {
  console.error('Redis cluster error:', err);
});

const generateRandomKey = () => `key-${Math.floor(Math.random() * 1000000)}`;
const generateRandomValue = () => `value-${Math.floor(Math.random() * 1000000)}`;

const setAndGetKey = () => {
  const key = generateRandomKey();
  const value = generateRandomValue();

  console.log(`Attempting to set key: ${key} with value: ${value}...`);

  cluster.set(key, value)
    .then(() => {
      console.log(`Successfully set key: ${key}`);
      return cluster.get(key);
    })
    .then((result) => {
      console.log(`Got key: ${key} from Redis with value: ${result}`);
    })
    .catch((err) => {
      console.error(`Error with Redis operation: ${err}`);
    })
    .finally(() => {
      // Continue to the next operation after a shorter delay
      setTimeout(setAndGetKey, 500); // Reduced delay to 500ms
    });
};

// Start the continuous set/get operations
setAndGetKey();
