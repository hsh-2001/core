import type { Context } from "hono";
import templeService from "./temple.service";
import type { AppEnv } from "../../shared/types";
import type { TempleQuery } from "./temple.types";
import { sendError, sendSuccess } from "../../shared/response";

const getQuery = (c: Context<AppEnv>) => Object.fromEntries(new URL(c.req.url).searchParams) as TempleQuery;

const create = async (c: Context<AppEnv>) => {
  try {
    const data = await templeService.create(await c.req.json());
    return sendSuccess(c, data, { message: "Temple created successfully", status: 201 });
  } catch (error) {
    return sendError(c, error, 400);
  }
};

const list = async (c: Context<AppEnv>) => {
  try {
    const data = await templeService.list(getQuery(c));
    return sendSuccess(c, data);
  } catch (error) {
    return sendError(c, error);
  }
};

const getById = async (c: Context<AppEnv>) => {
  try {
    const data = await templeService.getById(c.req.param("id"));
    return sendSuccess(c, data);
  } catch (error) {
    const status = error instanceof Error && error.message === "Temple not found" ? 404 : 400;
    return sendError(c, error, status);
  }
};

export default {
  create,
  list,
  getById,
};
