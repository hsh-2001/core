import templeRepo from "./temple.repository";
import type { Temple, TempleCreateInput, TempleQuery, TempleResponse } from "./temple.types";

const assertRequiredString = (value: unknown, fieldName: string) => {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${fieldName} is required`);
  }
};

const assertValidNumber = (value: unknown, fieldName: string) => {
  if (value === undefined || value === null || value === "") return;
  if (!Number.isFinite(Number(value))) {
    throw new Error(`${fieldName} must be a valid number`);
  }
};

const withMapUrl = (temple: Temple): TempleResponse => {
  const { latitude, longitude } = temple;
  const hasCoordinates = Number.isFinite(Number(latitude)) && Number.isFinite(Number(longitude));

  return {
    ...temple,
    mapUrl: hasCoordinates
      ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
      : null,
  };
};

const create = async (input: TempleCreateInput) => {
  assertRequiredString(input.nameEn, "nameEn");
  assertValidNumber(input.latitude, "latitude");
  assertValidNumber(input.longitude, "longitude");

  return withMapUrl(await templeRepo.create(input));
};

const list = async (query: TempleQuery = {}) => {
  const temples = await templeRepo.list(query);
  return temples.map(withMapUrl);
};

const getById = async (id: string) => {
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId <= 0) {
    throw new Error("Invalid temple id");
  }

  const temple = await templeRepo.getById(numericId);
  if (!temple) {
    throw new Error("Temple not found");
  }

  return withMapUrl(temple);
};

export default {
  create,
  list,
  getById,
};
