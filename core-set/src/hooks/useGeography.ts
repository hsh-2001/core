import { useCallback, useEffect, useState } from "react";
import geoApi from "../api/geo.api";
import type {
    GeographyDetail,
    GeographyFilters,
    ICommune,
    IDistrict,
    IProvince,
    IVillage,
} from "../types/geography";

type LoadingKey = "provinces" | "districts" | "communes" | "villages" | "detail";

const initialLoadingState: Record<LoadingKey, boolean> = {
    provinces: false,
    districts: false,
    communes: false,
    villages: false,
    detail: false,
};

export default function useGeography() {
    const [provinces, setProvinces] = useState<IProvince[]>([]);
    const [districts, setDistricts] = useState<IDistrict[]>([]);
    const [communes, setCommunes] = useState<ICommune[]>([]);
    const [villages, setVillages] = useState<IVillage[]>([]);
    const [detail, setDetail] = useState<GeographyDetail | null>(null);
    const [selectedProvinceId, setSelectedProvinceId] = useState<string | null>(null);
    const [selectedDistrictId, setSelectedDistrictId] = useState<string | null>(null);
    const [selectedCommuneId, setSelectedCommuneId] = useState<string | null>(null);
    const [selectedVillageId, setSelectedVillageId] = useState<string | null>(null);
    const [loading, setLoading] = useState<Record<LoadingKey, boolean>>(initialLoadingState);
    const [error, setError] = useState<string | null>(null);

    const setLoadingKey = (key: LoadingKey, value: boolean) => {
        setLoading((current) => ({ ...current, [key]: value }));
    };

    const getErrorMessage = (fallback: string, error: unknown) => {
        if (error instanceof Error && error.message) {
            return error.message;
        }

        return fallback;
    };

    const fetchProvinces = useCallback(async (filters?: GeographyFilters) => {
        setLoadingKey("provinces", true);
        setError(null);

        try {
            const response = await geoApi.callGetProvinces(filters);
            setProvinces(response.data.data ?? []);
        } catch (error) {
            setProvinces([]);
            setError(getErrorMessage("Failed to load provinces.", error));
        } finally {
            setLoadingKey("provinces", false);
        }
    }, []);

    const fetchDistricts = useCallback(async (provinceIdOrFilters?: string | GeographyFilters) => {
        setLoadingKey("districts", true);
        setError(null);

        try {
            const response = await geoApi.callGetDistricts(provinceIdOrFilters);
            setDistricts(response.data.data ?? []);
        } catch (error) {
            setDistricts([]);
            setError(getErrorMessage("Failed to load districts.", error));
        } finally {
            setLoadingKey("districts", false);
        }
    }, []);

    const fetchCommunes = useCallback(async (districtIdOrFilters?: string | GeographyFilters) => {
        setLoadingKey("communes", true);
        setError(null);

        try {
            const response = await geoApi.callGetCommunes(districtIdOrFilters);
            setCommunes(response.data.data ?? []);
        } catch (error) {
            setCommunes([]);
            setError(getErrorMessage("Failed to load communes.", error));
        } finally {
            setLoadingKey("communes", false);
        }
    }, []);

    const fetchVillages = useCallback(async (communeIdOrFilters?: string | GeographyFilters) => {
        setLoadingKey("villages", true);
        setError(null);

        try {
            const response = await geoApi.callGetVillages(communeIdOrFilters);
            setVillages(response.data.data ?? []);
        } catch (error) {
            setVillages([]);
            setError(getErrorMessage("Failed to load villages.", error));
        } finally {
            setLoadingKey("villages", false);
        }
    }, []);

    const fetchDetail = useCallback(async (
        params: Pick<GeographyFilters, "provinceId" | "districtId" | "communeId" | "villageId">,
    ) => {
        setLoadingKey("detail", true);
        setError(null);

        try {
            const response = await geoApi.callGetDetail(params);
            setDetail(response.data.data ?? null);
        } catch (error) {
            setDetail(null);
            setError(getErrorMessage("Failed to load geography detail.", error));
        } finally {
            setLoadingKey("detail", false);
        }
    }, []);

    const selectProvince = useCallback(async (provinceId: string) => {
        setSelectedProvinceId(provinceId);
        setSelectedDistrictId(null);
        setSelectedCommuneId(null);
        setSelectedVillageId(null);
        setCommunes([]);
        setVillages([]);

        await Promise.all([
            fetchDistricts(provinceId),
            fetchDetail({ provinceId }),
        ]);
    }, [fetchDetail, fetchDistricts]);

    const selectDistrict = useCallback(async (districtId: string) => {
        setSelectedDistrictId(districtId);
        setSelectedCommuneId(null);
        setSelectedVillageId(null);
        setVillages([]);

        await Promise.all([
            fetchCommunes(districtId),
            fetchDetail({ districtId }),
        ]);
    }, [fetchCommunes, fetchDetail]);

    const selectCommune = useCallback(async (communeId: string) => {
        setSelectedCommuneId(communeId);
        setSelectedVillageId(null);

        await Promise.all([
            fetchVillages(communeId),
            fetchDetail({ communeId }),
        ]);
    }, [fetchDetail, fetchVillages]);

    const selectVillage = useCallback(async (villageId: string) => {
        setSelectedVillageId(villageId);
        await fetchDetail({ villageId });
    }, [fetchDetail]);

    const resetSelection = useCallback(() => {
        setSelectedProvinceId(null);
        setSelectedDistrictId(null);
        setSelectedCommuneId(null);
        setSelectedVillageId(null);
        setDistricts([]);
        setCommunes([]);
        setVillages([]);
        setDetail(null);
        setError(null);
    }, []);

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            void fetchProvinces();
        }, 0);

        return () => window.clearTimeout(timeoutId);
    }, [fetchProvinces]);

    return {
        provinces,
        setProvinces,
        districts,
        setDistricts,
        communes,
        setCommunes,
        villages,
        setVillages,
        detail,
        selectedProvinceId,
        selectedDistrictId,
        selectedCommuneId,
        selectedVillageId,
        loading,
        error,
        fetchProvinces,
        fetchDistricts,
        fetchCommunes,
        fetchVillages,
        fetchDetail,
        selectProvince,
        selectDistrict,
        selectCommune,
        selectVillage,
        resetSelection,
    };
}
