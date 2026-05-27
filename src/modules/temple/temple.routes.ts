import { Hono } from "hono";
import templeController from "./temple.controller";
import type { AppEnv } from "../../shared/types";

const temple = new Hono<AppEnv>();

temple.post("/", templeController.create);
temple.get("/", templeController.list);
temple.get("/:id", templeController.getById);

export default temple;
