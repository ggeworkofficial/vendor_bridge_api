import { createError } from "../helpers/error";
import { removeUndefined } from "../utils/removeUndefined";
import {
  createSetting,
  getSettingByKey,
  getSettings,
  updateSetting,
  deleteSetting,
  SettingsResult,
  SettingsBase,
} from "../repositories/settings.repository";
import { CreateSettingsBody, GetSettingsParams, GetSettingsQuery, UpdateSettingsBody } from "../validators/settings.validator";
import { Role } from "../middleware/roleChecker";
import { PaginationResponse } from "../types/pageination";

export default class SettingsService {
  async createSettings(role: Role, data: CreateSettingsBody): Promise<SettingsResult> {
    if (role !== "admin") throw createError("Forbidden", 403);

    const existing = await getSettingByKey(data.key);
    if (existing) throw createError("Setting key already exists", 400);

    try {
      JSON.stringify(data.value);
    } catch {
      throw createError("Value must be JSON serializable", 400);
    }

    const id = crypto.randomUUID();
    const created_at = new Date();
    const updated_at = new Date();

    const cleanData = removeUndefined({ id, ...data, created_at, updated_at });
    return await createSetting(cleanData as SettingsBase);
  }

  async getSetting(params: GetSettingsParams, role: Role): Promise<SettingsResult> {
    const setting = await getSettingByKey(params.key);
    if (!setting) throw createError("Setting not found", 404);
    if (!setting.is_public && role !== "admin") throw createError("Forbidden", 403);
    return setting;
  }

  async getSettings(query: GetSettingsQuery, role: Role): Promise<PaginationResponse<SettingsResult>> {
    const cleanQuery = removeUndefined(query);
    const publicOnly = role !== "admin";
    return await getSettings(cleanQuery, publicOnly);
  }

  async updateSettings(role: Role, params: GetSettingsParams & UpdateSettingsBody): Promise<SettingsResult> {
    if (role !== "admin") throw createError("Forbidden", 403);

    const setting = await getSettingByKey(params.key);
    if (!setting) throw createError("Setting not found", 404);

    if (params.key && params.key !== setting.key) {
      const duplicate = await getSettingByKey(params.key);
      if (duplicate) throw createError("Setting key already exists", 400);
    }

    if (params.value !== undefined) {
      try {
        JSON.stringify(params.value);
      } catch {
        throw createError("Value must be JSON serializable", 400);
      }
    }

    const updated_at = new Date();
    const cleanData = removeUndefined({ ...params, updated_at });
    delete (cleanData as any).key;

    const result = await updateSetting(setting.key, cleanData as any);
    if (!result) throw createError("Setting not found", 404);
    return result;
  }

  async deleteSettings(role: Role, params: GetSettingsParams): Promise<boolean> {
    if (role !== "admin") throw createError("Forbidden", 403);

    const setting = await getSettingByKey(params.key);
    if (!setting) throw createError("Setting not found", 404);

    const success = await deleteSetting(params.key);
    if (!success) throw createError("Setting not found", 404);
    return success;
  }
}
