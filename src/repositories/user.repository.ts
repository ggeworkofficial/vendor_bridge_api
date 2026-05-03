import { Op, WhereOptions } from "sequelize";
import User from "../models/user.model";

export interface CreateUserPayload {
  id: string;
  full_name: string;
  email: string;
  password: string;
  role?: string;
  status?: string;
}

export interface FindUsersOptions {
  page: number;
  limit: number;
  role?: string;
  status?: string;
  search?: string | undefined;
  sort: string;
  order: "asc" | "desc";
}

export interface UpdateUserPayload {
  full_name?: string;
  email?: string;
  role?: string;
  status?: string;
}

export const createUser = async (payload: CreateUserPayload) => {
  return User.create(payload);
};

export const findUserById = async (id: string) => {
  return User.findByPk(id);
};

export const findUserByEmail = async (email: string) => {
  return User.findOne({ where: { email } });
};

export const findUsers = async (options: FindUsersOptions) => {
  const { page, limit, role, status, search, sort, order } = options;
  const where: WhereOptions<any> = {};

  if (role) {
    where.role = role;
  }

  if (status) {
    where.status = status;
  }

  if (search) {
    Object.assign(where, {
        [Op.or]: [
        { full_name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        ],
    });
  }

  const offset = (page - 1) * limit;

  const allowedSort = ["full_name", "email", "created_at"];
  const allowedOrder = ["asc", "desc"];

  const sortBy = allowedSort.includes(sort) ? sort : "created_at";
  const sortOrder = allowedOrder.includes(order) ? order : "desc";

  return User.findAndCountAll({
    where,
    order: [[sortBy, sortOrder]],
    limit,
    offset,
  });
};

export const updateUser = async (id: string, payload: UpdateUserPayload) => {
  await User.update(payload, { where: { id } });
  return findUserById(id);
};

export const destroyUser = async (id: string) => {
  return User.destroy({ where: { id } });
};
