import api from "./axios";
import type {
    ApiResponse,
    GeographyDetail,
    GeographyFilters,
    ICommune,
    IDistrict,
    IProvince,
    IVillage,
} from "../types/geography";

const callGetProvinces = async (params?: GeographyFilters) => {
    return await api.get<ApiResponse<IProvince[]>>("/geography/provinces", { params });
}

const callGetDistricts = async (provinceIdOrParams?: string | GeographyFilters) => {
    const params = typeof provinceIdOrParams === "string"
        ? { provinceId: provinceIdOrParams }
        : provinceIdOrParams;

    return await api.get<ApiResponse<IDistrict[]>>("/geography/districts", { params });
}

const callGetCommunes = async (districtIdOrParams?: string | GeographyFilters) => {
    const params = typeof districtIdOrParams === "string"
        ? { districtId: districtIdOrParams }
        : districtIdOrParams;

    return await api.get<ApiResponse<ICommune[]>>("/geography/communes", { params });
}

const callGetVillages = async (communeIdOrParams?: string | GeographyFilters) => {
    const params = typeof communeIdOrParams === "string"
        ? { communeId: communeIdOrParams }
        : communeIdOrParams;

    return await api.get<ApiResponse<IVillage[]>>("/geography/villages", { params });
}

const callGetDetail = async (params: Pick<GeographyFilters, "provinceId" | "districtId" | "communeId" | "villageId">) => {
    return await api.get<ApiResponse<GeographyDetail>>("/geography/detail", { params });
}

export default {
    callGetProvinces,
    callGetDistricts,
    callGetCommunes,
    callGetVillages,
    callGetDetail,
}
