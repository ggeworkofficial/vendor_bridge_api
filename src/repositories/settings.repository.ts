import { Op, WhereOptions } from "sequelize";
import { Setting } from "../models";
import { PaginationResponse } from "../types/pageination";

export interface SettingsBase {
  id: string;
  key: string;
  value: object;
  description?: string;
  is_public: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateSettingsResult {
  id: string;
  key: string;
  value: object;
  description?: string;
  is_public: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface SettingsResult {
  id: string;
  key: string;
  value: object;
  description?: string;
  is_public: boolean;
  created_at: Date;
  updated_at: Date;
}

type GetSettingsPayload = {
  page: number;
  limit: number;
  search?: string;
  order: 'asc' | 'desc';
};

export const createSetting = async (data: SettingsBase): Promise<CreateSettingsResult> => {
  const setting = await Setting.create(data as any);
  return setting;
};

export const getSettingByKey = async (key: string): Promise<SettingsResult | null> => {
  const setting = await Setting.findOne({ where: { key } });
  if (!setting) return null;
  return setting;
};

export const getSettings = async (payload: GetSettingsPayload, publicOnly: boolean): Promise<PaginationResponse<SettingsResult>> => {
  const { page, limit, search, order } = payload;
  const where: WhereOptions<any> = {};
  const offset = (page - 1) * limit;
  if (publicOnly) where.is_public = true;

  if (search) {
    Object.assign(where, {
      [Op.or]: [
        { key: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ],
    });
  }

  const { rows, count } = await Setting.findAndCountAll({
    where,
    limit,
    offset,
    order: [["created_at", order ]],
  });

  return {
    data: rows.map((row) => row),
    meta: {
      page,
      limit,
      total: count,
    },
  };
};

export const updateSetting = async (key: string, data: Partial<Omit<SettingsBase, "id">>): Promise<SettingsResult | null> => {
  const setting = await Setting.findOne({ where: { key } });
  if (!setting) return null;
  await setting.update(data);
  return setting;
};

export const deleteSetting = async (key: string): Promise<boolean> => {
  const deleted = await Setting.destroy({ where: { key } });
  return deleted > 0;
};

export const findSettingByKey = async (key: string): Promise<SettingsResult | null> => {
  return await getSettingByKey(key);
};
