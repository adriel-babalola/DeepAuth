import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import dotenv from 'dotenv';

dotenv.config();

const hasUpstashConfig = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;

let redis;
let verifyLimiter;
let apiLimiter;
let generalLimiter;

if (hasUpstashConfig) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  verifyLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "60 s"),
    analytics: true,
    prefix: "ratelimit:verify",
  });


  apiLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, "60 s"),
    analytics: true,
    prefix: "ratelimit:api",
  });

  generalLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, "60 s"),
    analytics: true,
    prefix: "ratelimit:general",
  });

  console.log('✅ Upstash rate limiting enabled');
} else {
  console.warn('⚠️  Upstash not configured - rate limiting disabled');
  
  const mockLimiter = {
    limit: async () => ({
      success: true,
      remaining: 999,
      limit: 999,
      reset: Date.now() + 60000
    })
  };

  verifyLimiter = mockLimiter;
  apiLimiter = mockLimiter;
  generalLimiter = mockLimiter;
}

export { verifyLimiter, apiLimiter, generalLimiter };