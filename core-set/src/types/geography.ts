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