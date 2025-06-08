import AsyncStorage from '@react-native-async-storage/async-storage';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiration: number;
}

interface CacheConfig {
  defaultTTL?: number; 
  keyPrefix?: string;
}

class CacheService {
  private defaultTTL: number;
  private keyPrefix: string;

  constructor(config: CacheConfig = {}) {
    this.defaultTTL = config.defaultTTL || 30 * 60 * 1000; 
    this.keyPrefix = config.keyPrefix || 'nextrep_cache_';
  }

  private generateKey(key: string): string {
    return `${this.keyPrefix}${key}`;
  }

  async set<T>(key: string, data: T, ttl?: number): Promise<void> {
    try {
      const expiration = ttl || this.defaultTTL;
      const cacheItem: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        expiration: Date.now() + expiration,
      };

      const cacheKey = this.generateKey(key);
      await AsyncStorage.setItem(cacheKey, JSON.stringify(cacheItem));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const cacheKey = this.generateKey(key);
      const cached = await AsyncStorage.getItem(cacheKey);
      
      if (!cached) {
        return null;
      }

      const cacheItem: CacheItem<T> = JSON.parse(cached);
      
      // Check if cache has expired
      if (Date.now() > cacheItem.expiration) {
        await this.remove(key);
        return null;
      }

      return cacheItem.data;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async remove(key: string): Promise<void> {
    try {
      const cacheKey = this.generateKey(key);
      await AsyncStorage.removeItem(cacheKey);
    } catch (error) {
      console.error('Cache remove error:', error);
    }
  }

  async clear(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(this.keyPrefix));
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }

  async getCacheInfo(key: string): Promise<{
    exists: boolean;
    timestamp?: number;
    expiresAt?: number;
    ttl?: number;
  }> {
    try {
      const cacheKey = this.generateKey(key);
      const cached = await AsyncStorage.getItem(cacheKey);
      
      if (!cached) {
        return { exists: false };
      }

      const cacheItem: CacheItem<any> = JSON.parse(cached);
      const now = Date.now();
      
      return {
        exists: true,
        timestamp: cacheItem.timestamp,
        expiresAt: cacheItem.expiration,
        ttl: Math.max(0, cacheItem.expiration - now),
      };
    } catch (error) {
      console.error('Cache info error:', error);
      return { exists: false };
    }
  }

  async isValid(key: string): Promise<boolean> {
    const info = await this.getCacheInfo(key);
    return info.exists && (info.ttl || 0) > 0;
  }
}

export const exerciseCache = new CacheService({
  defaultTTL: 60 * 60 * 1000, // 1 hour for exercises
  keyPrefix: 'exercises_',
});

export const exerciseDetailCache = new CacheService({
  defaultTTL: 2 * 60 * 60 * 1000, // 2 hours for exercise details
  keyPrefix: 'exercise_details_',
});

export const generalCache = new CacheService({
  defaultTTL: 30 * 60 * 1000, // 30 minutes for general data
  keyPrefix: 'general_',
});

export default CacheService; 