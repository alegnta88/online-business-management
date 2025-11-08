import redisClient from '../config/redis.js';

export const getCartKey = (customerId) => `cart:${customerId}`;

export const getCart = async (customerId) => {
  const key = getCartKey(customerId);
  const data = await redisClient.get(key);
  return data ? JSON.parse(data) : { items: [], total: 0 };
};

export const saveCart = async (customerId, cart) => {
  const key = getCartKey(customerId);
  await redisClient.set(key, JSON.stringify(cart), { EX: 86400 });
};

export const clearCart = async (customerId) => {
  const key = getCartKey(customerId);
  await redisClient.del(key);
};