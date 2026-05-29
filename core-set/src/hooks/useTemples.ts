import { useCallback, useEffect, useState } from "react";
import templeApi from "../api/temple.api";
import type { Temple, TempleCreateInput, TempleQuery } from "../types/temple";

type LoadingKey = "list" | "detail" | "create";

const initialLoadingState: Record<LoadingKey, boolean> = {
  list: false,
  detail: false,
  create: false,
};

const normalizeCreateInput = (input: TempleCreateInput): TempleCreateInput => {
  const normalizeString = (value: string | undefined) => {
    const trimmed = value?.trim();
    return trimmed ? trimmed : undefined;
  };

  return {
    nameEn: input.nameEn.trim(),
    nameKm: normalizeString(input.nameKm),
    description: normalizeString(input.description),
    imageUrl: normalizeString(input.imageUrl),
    provinceId: normalizeString(input.provinceId),
    districtId: normalizeString(input.districtId),
    communeId: normalizeString(input.communeId),
    villageId: normalizeString(input.villageId),
    latitude: normalizeString(input.latitude),
    longitude: normalizeString(input.longitude),
  };
};

export default function useTemples() {
  const [temples, setTemples] = useState<Temple[]>([]);
  const [selectedTemple, setSelectedTemple] = useState<Temple | null>(null);
  const [query, setQuery] = useState<TempleQuery>({ limit: "20", offset: "0" });
  const [loading, setLoading] = useState<Record<LoadingKey, boolean>>(initialLoadingState);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const setLoadingKey = (key: LoadingKey, value: boolean) => {
    setLoading((current) => ({ ...current, [key]: value }));
  };

  const getErrorMessage = (fallback: string, error: unknown) => {
    if (error instanceof Error && error.message) {
      return error.message;
    }

    return fallback;
  };

  const fetchTemples = useCallback(async (filters: TempleQuery = { limit: "20", offset: "0" }) => {
    setLoadingKey("list", true);
    setError(null);

    try {
      const response = await templeApi.callListTemples(filters);
      setTemples(response.data.data ?? []);
      setQuery(filters);
    } catch (error) {
      setTemples([]);
      setError(getErrorMessage("Failed to load temples.", error));
    } finally {
      setLoadingKey("list", false);
    }
  }, []);

  const fetchTemple = useCallback(async (id: number | string) => {
    setLoadingKey("detail", true);
    setError(null);

    try {
      const response = await templeApi.callGetTemple(id);
      setSelectedTemple(response.data.data ?? null);
    } catch (error) {
      setSelectedTemple(null);
      setError(getErrorMessage("Failed to load temple detail.", error));
    } finally {
      setLoadingKey("detail", false);
    }
  }, []);

  const createTemple = useCallback(async (input: TempleCreateInput) => {
    setLoadingKey("create", true);
    setError(null);
    setMessage(null);

    try {
      const response = await templeApi.callCreateTemple(normalizeCreateInput(input));
      const temple = response.data.data;

      setSelectedTemple(temple);
      setMessage(response.data.message || "Temple created successfully.");
      await fetchTemples({ ...query, offset: query.offset ?? "0" });
      return temple;
    } catch (error) {
      setError(getErrorMessage("Failed to create temple.", error));
      return null;
    } finally {
      setLoadingKey("create", false);
    }
  }, [fetchTemples, query]);

  const clearFeedback = useCallback(() => {
    setError(null);
    setMessage(null);
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchTemples({ limit: "20", offset: "0" });
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchTemples]);

  return {
    temples,
    selectedTemple,
    query,
    loading,
    error,
    message,
    setSelectedTemple,
    fetchTemples,
    fetchTemple,
    createTemple,
    clearFeedback,
  };
}
