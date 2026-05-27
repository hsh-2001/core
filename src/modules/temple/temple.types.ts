export type TempleCreateInput = {
  nameEn?: string;
  nameKm?: string;
  description?: string;
  imageUrl?: string;
  provinceId?: string;
  districtId?: string;
  communeId?: string;
  villageId?: string;
  latitude?: number | string;
  longitude?: number | string;
};

export type TempleQuery = {
  q?: string;
  provinceId?: string;
  districtId?: string;
  communeId?: string;
  villageId?: string;
  limit?: string;
  offset?: string;
};

export type Temple = {
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
};

export type TempleResponse = Temple & {
  mapUrl: string | null;
};
