export interface IProvince {
    id: string;
    name_en: string;
    name_km: string;
    capital_city?: string;
}

export interface IDistrict {
    id: string;
    name_en: string;
    name_km: string;
    province_id: string;
}

export interface ICommune {
    id: string;
    name_en: string;
    name_km: string;
    province_id: string;
    district_id: string;
}

export interface IVillage {
    id: string;
    name_en: string;
    name_km: string;
    province_id: string;
    district_id: string;
    commune_id: string;
}

export type GeographyLevel = "province" | "district" | "commune" | "village";

export type GeographyItem = IProvince | IDistrict | ICommune | IVillage;

export interface GeographyFilters {
    id?: string;
    name_en?: string;
    name_km?: string;
    capital_city?: string;
    province_id?: string;
    district_id?: string;
    commune_id?: string;
    provinceId?: string;
    districtId?: string;
    communeId?: string;
    villageId?: string;
    q?: string;
}

export interface GeographyDetail {
    province?: IProvince;
    district?: IDistrict;
    commune?: ICommune;
    village?: IVillage;
    districts?: IDistrict[];
    communes?: ICommune[];
    villages?: IVillage[];
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
}
