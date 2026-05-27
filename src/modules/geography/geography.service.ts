import type { GeographyLevel, GeographyQuery } from "./geography.types";
import geoRepo from "./geography.repository";

const getStringValue = (value: unknown) => {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
};

const list = async (level: GeographyLevel, query: GeographyQuery = {}) => {
  return geoRepo.list(level, query);
};

const getDetail = async (query: GeographyQuery) => {
  const villageId = getStringValue(query.villageId) ?? getStringValue(query.id);
  const communeId = getStringValue(query.communeId);
  const districtId = getStringValue(query.districtId);
  const provinceId = getStringValue(query.provinceId);

  if (villageId) {
    const village = await geoRepo.getOne("villages", villageId);
    const commune = await geoRepo.getOne("communes", village?.commune_id);
    const district = await geoRepo.getOne("districts", village?.district_id);
    const province = await geoRepo.getOne("provinces", village?.province_id);

    return { province, district, commune, village };
  }

  if (communeId) {
    const commune = await geoRepo.getOne("communes", communeId);
    const district = await geoRepo.getOne("districts", commune?.district_id);
    const province = await geoRepo.getOne("provinces", commune?.province_id);
    const villages = await geoRepo.list("villages", { commune_id: communeId });

    return { province, district, commune, villages };
  }

  if (districtId) {
    const district = await geoRepo.getOne("districts", districtId);
    const province = await geoRepo.getOne("provinces", district?.province_id);
    const communes = await geoRepo.list("communes", { district_id: districtId });

    return { province, district, communes };
  }

  if (provinceId) {
    const province = await geoRepo.getOne("provinces", provinceId);
    const districts = await geoRepo.list("districts", { province_id: provinceId });

    return { province, districts };
  }

  throw new Error("Provide one of `provinceId`, `districtId`, `communeId`, or `villageId`");
};

export default {
  list,
  getDetail,
};
