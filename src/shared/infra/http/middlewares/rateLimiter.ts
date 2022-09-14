import {Request, Response, NextFunction} from 'express';
import {RateLimiterRedis} from 'rate-limiter-flexible';
import * as redis from 'redis';

import {AppError} from '@shared/errors/AppError';

const redisClient = redis.createClient({
    legacyMode: true,
    socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        sessionTimeout: 20,
    },
});

const limiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'rateLimiter',
    points: 5,
    duration: 5,
});

export default async function rateLimiter(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    try {
        await redisClient.connect();

        await limiter.consume(req.ip);

        return next();
    } catch (err) {
        throw new AppError('Too many requests!', 429);
    } finally {
        await redisClient.disconnect();
    }
}
