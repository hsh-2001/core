import { useEffect, useState } from "react";
import type { IProvince } from "../types/geography";
import geoApi from "../api/geo.api";

export default function useGeography() {
    const [provinces, setProvinces] = useState<IProvince[]>([]);
    const [districts, setDistricts] = useState([]);

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

    const fetchDistricts = async (provinceId: string) => {
        try {
            const response = await geoApi.callGetDistricts(provinceId);

            if (response.status === 200) {
                setDistricts(response.data.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const init = async () => {
            await fetchProvinces();
        };

        init();
    }, []);

    return {
        provinces,
        setProvinces,
        districts,
        setDistricts,
        fetchDistricts,
    };
}