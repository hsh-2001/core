import { Hono } from "hono";
import geographyController from "./geography.controller";
import type { AppEnv } from "../../shared/types";

const geography = new Hono<AppEnv>();

geography.get("/provinces", geographyController.getProvinces);
geography.get("/districts", geographyController.getDistricts);
geography.get("/communes", geographyController.getCommunes);
geography.get("/villages", geographyController.getVillages);
geography.get("/detail", geographyController.getDetail);

export default geography;
