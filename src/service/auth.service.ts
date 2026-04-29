import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { createUser, createSession, findUserByEmail } from "../repositories/auth.repository";
import { User } from "../models";
import { createError } from "../helpers/error";

interface RegisterPayload {
  full_name: string;
  email: string;
  password: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

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


class AuthService {
  private sanitizeUser(user: User): AuthResult {
    const plain = user.get({ plain: true });
    const { password, ...rest } = plain;
    return rest as AuthResult;
  }

  async register(payload: RegisterPayload): Promise<AuthResult> {
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

  async login(payload: LoginPayload): Promise<AuthResult> {
    const email = payload.email.toLowerCase();

    const user = await findUserByEmail(email);
    if (!user) throw createError("Invalid credentials", 401);

    const passwordMatches = await bcrypt.compare(payload.password, user.password);
    if (!passwordMatches) throw createError("Invalid credentials", 401);

    const sessionId = randomUUID();
    const lastActive = new Date();
    await createSession(sessionId, user.id, lastActive);

    return {
      ...this.sanitizeUser(user),
      session_id: sessionId,
      last_active: lastActive,
    };
  }
}

export default new AuthService();
