export interface Temple {
  id: number;
  nameEn: string;
  nameKm: string | null;
  description: string | null;
  imageUrl: string | null;
  provinceId: string | null;
  districtId: string | null;
  communeId: string | null;
  villageId: string | null;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
  updatedAt: string;
  mapUrl: string | null;
}

export interface TempleCreateInput {
  nameEn: string;
  nameKm?: string;
  description?: string;
  imageUrl?: string;
  provinceId?: string;
  districtId?: string;
  communeId?: string;
  villageId?: string;
  latitude?: string;
  longitude?: string;
}

export interface TempleQuery {
  q?: string;
  provinceId?: string;
  districtId?: string;
  communeId?: string;
  villageId?: string;
  limit?: string;
  offset?: string;
}

export interface TempleApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
