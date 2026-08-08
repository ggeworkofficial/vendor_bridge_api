import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { createUser, createSession, findUserByEmail, getSession, updateSession, findUserById, removeSession, getUserRole, getUserStatus } from "../repositories/auth.repository";
import { User } from "../models";
import { createError } from "../helpers/error";
import { LoginBody, RegisterBody } from "../validators/auth.validator";


interface AuthResult {
  id: string;
  full_name: string;
  email: string;
  role: string;
  status: string;
  created_at: Date;
  updated_at: Date;
  session_id?: string;
  last_active?: Date;
}

interface SessionReuslt {
  user_id: string;
  last_active: Date;
  ttl: number;
  role: string;
}


class AuthService {
  private sanitizeUser(user: User): AuthResult {
    const plain = user.get({ plain: true });
    const { password, ...rest } = plain;
    return rest as AuthResult;
  }

  async register(payload: RegisterBody): Promise<AuthResult> {
    const email = payload.email.toLowerCase();

    const existingUser = await findUserByEmail(email);
    if (existingUser) throw createError("Email already in use", 400);
    
    const userId = randomUUID();
    const hashedPassword = await bcrypt.hash(payload.password, 10);

    const user = await createUser({
      id: userId,
      full_name: payload.full_name,
      email,
      password: hashedPassword,
    });

    return this.sanitizeUser(user);
  }

  async login(payload: LoginBody): Promise<AuthResult> {
    const email = payload.email.toLowerCase();

    const user = await findUserByEmail(email);
    if (!user) throw createError("Invalid credentials", 401);

    const passwordMatches = await bcrypt.compare(payload.password, user.password);
    if (!passwordMatches) throw createError("Invalid credentials", 401);

    const userStatus = await getUserStatus(user.id);
    if (!userStatus || userStatus === 'suspended') {
      throw createError("Account is suspended", 403);
    }

    const sessionId = randomUUID();
    const lastActive = new Date();
    await createSession(sessionId, user.role, user.id, lastActive);

    return {
      ...this.sanitizeUser(user),
      session_id: sessionId,
      last_active: lastActive,
    };
  }

  async validateSession(sessionId: string): Promise<SessionReuslt> {
    const session = await getSession(sessionId);
    if (!session) throw createError("Invalid session", 401);

    if (session.ttl <= 0) throw createError("Session expired", 401);

    return {
      user_id: session.user_id,
      last_active: session.last_active,
      ttl: session.ttl,
      role: session.role,
    };
  }

  async updateSession(sessionId: string, userId: string, lastActive: Date) {
    await updateSession(sessionId, userId, lastActive);
  }

  async logout(sessionId: string) {
    await removeSession(sessionId);
  }
}

export default new AuthService();
