import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

class MemoryStore {
    private store = new Map<string, { value: string; expiry: number }>();

    async get(key: string) {
        const item = this.store.get(key);
        if (!item) return null;
        if (item.expiry < Date.now()) {
            this.store.delete(key);
            return null;
        }
        return item.value;
    }

    async set(key: string, value: string, mode?: string, duration?: number) {
        let expiry = Infinity;
        if (mode === 'EX' && duration) {
            expiry = Date.now() + duration * 1000;
        }
        this.store.set(key, { value, expiry });
        return 'OK';
    }

    async del(key: string) {
        this.store.delete(key);
        return 1;
    }
}

let redisProxy: any;

try {
    const redis = new Redis(redisUrl, {
        maxRetriesPerRequest: 0, // Fail fast to trigger fallback
        commandTimeout: 1000,
        enableOfflineQueue: false, // Don't queue if offline
        retryStrategy: () => null // Don't retry at connection level
    });

    const memoryFallback = new MemoryStore();
    let useFallback = false;

    redis.on('error', (err) => {
        if (!useFallback) {
            console.warn('Redis connection failed, switching to memory fallback.');
            useFallback = true;
        }
    });

    redis.on('connect', () => {
        console.log('Redis connected successfully.');
        useFallback = false;
    });

    const safeCall = async (method: string, ...args: any[]) => {
        if (useFallback) return (memoryFallback as any)[method](...args);

        try {
            return await (redis as any)[method](...args);
        } catch (err) {
            console.warn(`Redis ${method} failed, trying memory fallback:`, (err as Error).message);
            useFallback = true; // Switch to fallback for future calls
            return (memoryFallback as any)[method](...args);
        }
    };

    redisProxy = {
        get: (key: string) => safeCall('get', key),
        set: (key: string, value: string, mode?: string, duration?: number) => safeCall('set', key, value, mode, duration),
        del: (key: string) => safeCall('del', key),
    };

} catch (e) {
    console.warn('Could not initialize Redis client, using memory fallback.');
    redisProxy = new MemoryStore();
}

export default redisProxy;
