// const Redis = require("ioredis");
// const dotenv = require("dotenv");

// dotenv.config();

// const redis = new Redis(process.env.UPSTASH_REDIS_URL,  {tls: {},  // explicitly enable TLS
//   maxRetriesPerRequest: 5, // optional: reduce retry attempts
//   reconnectOnError: () => true,});
// redis.on('error', (err) => {
//   console.error('Redis error:', err);
// });
// // await redis.set(`stripe_session:${sessionId}`, userId, "EX", 3600); // 1 hour

// module.exports = redis;
const Redis = require("ioredis");
const dotenv = require("dotenv");

dotenv.config();

let redis;

try {
  redis = new Redis(process.env.UPSTASH_REDIS_URL, {
    tls: {}, // enable TLS for Upstash
    maxRetriesPerRequest: 5,
    reconnectOnError: () => true,
  });

  redis.on("connect", () => {
    console.log("✅ Redis connected");
  });

  redis.on("error", (err) => {
    console.error("❌ Redis error:", err);
  });
} catch (error) {
  console.error("❌ Redis connection setup failed:", error.message);
}

module.exports = redis;
