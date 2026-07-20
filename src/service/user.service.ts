import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { createError } from "../helpers/error";
import {
  CreateUserPayload,
  createUser,
  destroyUser,
  findUserByEmail,
  findUserById,
  findUsers,
  updateUser,
  UpdateUserPayload,
} from "../repositories/user.repository";
import { User } from "../models";
import { CreateUserBody, DeleteUserParams, GetUserQuery, UpdateUserBody } from "../validators/user.validator";
import { removeUndefined } from "../utils/removeUndefined";
import { clearSessionsForUser, removeSession } from "../repositories/auth.repository";
import { file } from "zod";

interface PaginationResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

interface UserResult {
    id: string;
    full_name: string;
    email: string;
    role?: string;
    status?: string;
}


class UserService {
  private sanitizeUser(user: User): UserResult {
    const plainUser = user.get({ plain: true }) as User;
    const { password, ...rest } = plainUser;
    return rest;
  }

  async create(payload: CreateUserBody): Promise<UserResult> {
    const email = payload.email.toLowerCase();
    const existing = await findUserByEmail(email);
    if (existing) {
      throw createError("Email already registered", 409);
    }

    const user = await createUser({
      id: randomUUID(),
      full_name: payload.full_name,
      email,
      password: await bcrypt.hash(payload.password, 10),
      ...(payload.role && { role: payload.role }),
      ...(payload.status && { status: payload.status }),
    });

    return this.sanitizeUser(user);
  }

  async findOne(id: string): Promise<UserResult> {
    const user = await findUserById(id);
    if (!user) {
      throw createError("User not found", 404);
    }
    return this.sanitizeUser(user);
  }

  async findAll(options: GetUserQuery): Promise<PaginationResult<UserResult>> {
    const cleanOptions = removeUndefined(options)
    const result = await findUsers(cleanOptions);
    return {
      data: result.rows.map((user) => this.sanitizeUser(user)),
      meta: {
        page: options.page,
        limit: options.limit,
        total: result.count,
      },
    };
  }

  async update(id: string, payload: UpdateUserBody, adminUpdate = false): Promise<UserResult> {
    const user = await findUserById(id);
    if (!user) {
      throw createError("User not found", 404);
    }

    const userOnlyUpdate = ['email', 'full_name'];
    const adminOnlyUpdate = ['role', 'status'];
    if (!adminUpdate) {
      for (const field of adminOnlyUpdate) {
        if (field in payload) {
          throw createError(`Unauthorized update fields`, 403);
        }
      }
      if (payload.email && payload.email !== user.email) {
        const existing = await findUserByEmail(payload.email.toLowerCase());
        if (existing) {
          throw createError("Email already registered", 409);
        }
      }
    }

    if (adminOnlyUpdate) {
      for (const field of userOnlyUpdate) {
        if (field in payload) 
          throw createError(`Admin cant update ${field}`, 403);
      }
    }

    

    const normalizedPayload: UpdateUserBody = { ...payload };
    if (normalizedPayload.email) {
      normalizedPayload.email = normalizedPayload.email.toLowerCase();
    }
    const cleanPayload = removeUndefined(normalizedPayload);
    const updated = await updateUser(id, cleanPayload);
    if (!updated) {
      throw createError("Unable to update user", 400);
    }

    const isBecomingSuspended =
    payload.status === 'suspended' && user.status !== 'suspended';

    const isRoleChanged =
    payload.role && payload.role !== user.role;
    if (adminUpdate && (isBecomingSuspended || isRoleChanged)) {
        await clearSessionsForUser(id);
    }

    return this.sanitizeUser(updated);
  }

  async delete(id: DeleteUserParams["id"]) {
    const deleted = await destroyUser(id);
    if (!deleted) throw createError("User not found", 404);
    await clearSessionsForUser(id);
  }
}

export default new UserService();
