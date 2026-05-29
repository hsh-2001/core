import api from "./axios";

const callGetProvinces = async () => {
    return await api.get("/geography/provinces");
}

export default {
    callGetProvinces
}