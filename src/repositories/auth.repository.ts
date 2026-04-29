import User from "../models/user.model";
import redis from "../connection/redis";

const SESSION_TTL = 60 * 7; // 7 minutes

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

export const createUser = async (payload: CreateUserPayload) => {
  return User.create(payload as any);
};

export const createSession = async (sessionId: string, userId: string, lastActive: Date) => {
  const payload = JSON.stringify({ user_id: userId, last_active: lastActive.toISOString() });
  await redis.set(sessionId, payload, "EX", SESSION_TTL);
  return { sessionId, lastActive };
};
