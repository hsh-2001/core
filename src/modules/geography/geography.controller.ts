import type { Context } from "hono";
import geographyService from "./geography.service";
import type { GeographyLevel, GeographyQuery } from "./geography.types";
import type { AppEnv } from "../../shared/types";
import { sendError, sendSuccess } from "../../shared/response";

const getQuery = (c: Context<AppEnv>) => Object.fromEntries(new URL(c.req.url).searchParams) as GeographyQuery;

const listByLevel = (level: GeographyLevel) => async (c: Context<AppEnv>) => {
  try {
    const data = await geographyService.list(level, getQuery(c));
    return sendSuccess(c, data);
  } catch (error) {
    return sendError(c, error);
  }
};

const getDetail = async (c: Context<AppEnv>) => {
  try {
    const data = await geographyService.getDetail(getQuery(c));
    return sendSuccess(c, data);
  } catch (error) {
    return sendError(c, error, error instanceof Error && error.message.startsWith("Provide one") ? 400 : 500);
  }
};

export default {
  getProvinces: listByLevel("provinces"),
  getDistricts: listByLevel("districts"),
  getCommunes: listByLevel("communes"),
  getVillages: listByLevel("villages"),
  getDetail,
};
