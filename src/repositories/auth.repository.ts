import User from "../models/user.model";
import redis from "../connection/redis";

const SESSION_TTL = 7 * 24 * 60 * 60; // 7 days

export interface CreateUserPayload {
  id: string;
  full_name: string;
  email: string;
  password: string;
  role?: string;
  status?: string;
}

export const findUserByEmail = async (email: string) => {
  return User.findOne({ where: { email } });
};

export const findUserById = async (id: string) => {
  return User.findByPk(id);
};

export const createUser = async (payload: CreateUserPayload) => {
  return User.create(payload);
};

export const getUserRole = async (userId: string) => {
  const user = await findUserById(userId);
  return user?.role || null;
}

export const getUserStatus = async (userId: string) => {
  const user = await findUserById(userId);
  return user?.status || null;
}

export const createSession = async (sessionId: string, role: string, userId: string, lastActive: Date) => {
  const payload = JSON.stringify({ user_id: userId, role, last_active: lastActive.toISOString() });
  await redis.set(sessionId, payload, "EX", SESSION_TTL);
  await redis.sadd(`user_sessions:${userId}`, sessionId);
  return { sessionId, lastActive };
};

export const getSession = async (sessionId: string) => {
  const data = await redis.get(sessionId);
  const ttl = await redis.ttl(sessionId);
  if (!data) return null;

  const session = JSON.parse(data);
  return { 
    user_id: session.user_id, 
    role: session.role,
    last_active: new Date(session.last_active), 
    ttl 
  };
}

export const getSessionsForUser = async (userId: string) => {
  const sessionIds = await redis.smembers(`user_sessions:${userId}`);
  const sessions = [];
  for (const sessionId of sessionIds) {
    const session = await getSession(sessionId);
    if (session) {
      sessions.push({ sessionId, ...session });
    }
  }
  return sessions;
}

export const updateSession = async (sessionId: string, userId: string, lastActive: Date) => {
  const payload = JSON.stringify({ user_id: userId, last_active: lastActive.toISOString() });
  await redis.set(sessionId, payload, "EX", SESSION_TTL);
  return { sessionId, lastActive };
};

export const removeSession = async (sessionId: string, userId?: string) => {
  await redis.del(sessionId);
  if (userId) {
    await redis.srem(`user_sessions:${userId}`, sessionId);
  }
};

export const clearSessionsForUser = async (userId: string) => {
  const sessionIds = await redis.smembers(`user_sessions:${userId}`);
  for (const sessionId of sessionIds) {
    await redis.del(sessionId);
  }
  await redis.del(`user_sessions:${userId}`);
}