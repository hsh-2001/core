import userservice from "../services/userService";
import type { Context } from "hono";
import type { AppEnv } from "../types";

const register = async (c: Context<AppEnv>) => {
  const { webId, username, password, email } = await c.req.json();
  try {
    const response = await userservice.register({ webId, username, password, email });
    return c.json(response);
  } catch (error) {
    if (error instanceof Error) {
      return c.json({ error: error.message }, 500);
    }
    return c.json({ error: 'An unexpected error occurred' }, 500);
  }
}

const findOneUser = async (c: Context<AppEnv>) => {
  const { identifier } = c.req.param();
  try {
    const response = await userservice.findOneUser(identifier);
    return c.json(response);
  } catch (error) {
    if (error instanceof Error) {
      return c.json({ error: error.message }, 500);
    }
    return c.json({ error: 'An unexpected error occurred' }, 500);
  }
}

const getAllUsersByWebId = async (c: Context<AppEnv>) => {
  const { webId } = c.req.param();
  try {
    const response = await userservice.getAllUsersByWebId(Number(webId));
    return c.json(response);
  } catch (error) {
    if (error instanceof Error) {
      return c.json({ error: error.message }, 500);
    }
    return c.json({ error: 'An unexpected error occurred' }, 500);
  }
}

const login = async (c: Context<AppEnv>) => {
  const { identifier, password } = await c.req.json();
  try {
    const response = await userservice.login(identifier, password);
    return c.json(response);
  } catch (error) {
    if (error instanceof Error) {
      const status = error.message === 'User not found' || error.message === 'Invalid password' ? 401 : 500;
      return c.json({ error: error.message }, status);
    }
    return c.json({ error: 'An unexpected error occurred' }, 500);
  }
}

export default {
    register,
    findOneUser,
    getAllUsersByWebId,
    login
}
