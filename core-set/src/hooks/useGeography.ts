import { useEffect, useState } from "react";
import type { IProvince } from "../types/geography";
import geoApi from "../api/geo.api";

export default function useGeography() {
    const [provinces, setProvinces] = useState<IProvince[]>([]);

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await geoApi.callGetProvinces();
                if (response.status === 200) {
                    setProvinces(response.data.data);
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchProvinces();
    }, []);

    return {
        provinces,
        setProvinces,
    }
};