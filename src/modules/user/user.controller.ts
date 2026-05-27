import userservice from "./user.service";
import type { Context } from "hono";
import type { AppEnv } from "../../shared/types";
import { sendError, sendSuccess } from "../../shared/response";

const register = async (c: Context<AppEnv>) => {
  const { webId, username, password, email } = await c.req.json();
  try {
    const response = await userservice.register({ webId, username, password, email });
    return sendSuccess(c, response, { message: response.message });
  } catch (error) {
    return sendError(c, error);
  }
}

const findOneUser = async (c: Context<AppEnv>) => {
  const { identifier } = c.req.param();
  try {
    const response = await userservice.findOneUser(identifier);
    return sendSuccess(c, response);
  } catch (error) {
    return sendError(c, error);
  }
}

const getAllUsersByWebId = async (c: Context<AppEnv>) => {
  const { webId } = c.req.param();
  try {
    const response = await userservice.getAllUsersByWebId(Number(webId));
    return sendSuccess(c, response);
  } catch (error) {
    return sendError(c, error);
  }
}

const login = async (c: Context<AppEnv>) => {
  const { identifier, password } = await c.req.json();
  try {
    const response = await userservice.login(identifier, password);
    return sendSuccess(c, response, { message: "Login successful" });
  } catch (error) {
    if (error instanceof Error) {
      const status = error.message === 'User not found' || error.message === 'Invalid password' ? 401 : 500;
      return sendError(c, error, status);
    }
    return sendError(c, error);
  }
}

export default {
    register,
    findOneUser,
    getAllUsersByWebId,
    login
}
