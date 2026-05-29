import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../api/auth.api";

export default function useAuth() {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await authApi.callLogin({ identifier, password });
            if (response.status === 200) {
                const { token } = response.data;
                localStorage.setItem("token", token);
                navigate("/admin");
            }
        } catch (error) {
            console.error(error);
        }
    };

    return {
        identifier,
        setIdentifier,
        password,
        setPassword,
        handleSubmit,
    }
}