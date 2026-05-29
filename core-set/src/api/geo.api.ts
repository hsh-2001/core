import api from "./axios";

const callGetProvinces = async () => {
    return await api.get("/geography/provinces");
}

const callGetDistricts = async (provinceId: string) => {
    return await api.get("/geography/districts", { params: { provinceId } });
}

export default {
    callGetProvinces,
    callGetDistricts,
}