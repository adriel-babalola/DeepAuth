import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import dotenv from "dotenv";

dotenv.config();

const redis = Redis.fromEnv();

export const verifyLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "60 s"), // 10 requests per minute
    analytics: true,
    prefix: "verify:ratelimit"
});


export const apiLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, "60 s"), 
    analytics: true,
    prefix: "api:ratelimit"
});

export const generalLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, "60 s"), 
    analytics: true,
    prefix: "general:ratelimit"
});

export default verifyLimiter;

