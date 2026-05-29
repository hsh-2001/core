import type { ILoginRequest } from "../types/auth";
import api from "./axios";

const callLogin = async (data: ILoginRequest) => {
    return await api.post("/user/login", data);
}

export default {
    callLogin,
}