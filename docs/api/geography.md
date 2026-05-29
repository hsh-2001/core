# Geography APIs

Base path: `/api/geography`

The geography module exposes Cambodia administrative geography. List endpoints support filters such as `id`, `name_en`, `name_km`, snake_case parent IDs, camelCase parent IDs, and `q` for contains search across English names, Khmer names, and province capital cities.

## List Provinces

```http
GET /api/geography/provinces
```

Optional query params: `id`, `name_en`, `name_km`, `capital_city`, `q`.

## List Districts

```http
GET /api/geography/districts?provinceId=12
```

Optional query params: `id`, `province_id`, `provinceId`, `name_en`, `name_km`, `q`.

## List Communes

```http
GET /api/geography/communes?districtId=1201
```

Optional query params: `id`, `province_id`, `provinceId`, `district_id`, `districtId`, `name_en`, `name_km`, `q`.

## List Villages

```http
GET /api/geography/villages?communeId=120101
```

Optional query params: `id`, `province_id`, `provinceId`, `district_id`, `districtId`, `commune_id`, `communeId`, `name_en`, `name_km`, `q`.

## Detail

```http
GET /api/geography/detail?provinceId=12
GET /api/geography/detail?districtId=1201
GET /api/geography/detail?communeId=120101
GET /api/geography/detail?villageId=12010101
```

Returns the selected geography record and its related parent or child records.

| Query | Response data |
| --- | --- |
| `provinceId` | `province`, `districts` |
| `districtId` | `province`, `district`, `communes` |
| `communeId` | `province`, `district`, `commune`, `villages` |
| `villageId` | `province`, `district`, `commune`, `village` |

If no supported ID is provided, the API returns `400`.

## Geography Item

```json
{
  "id": "1201",
  "name_en": "District name",
  "name_km": "ឈ្មោះស្រុក",
  "capital_city": "Capital city name",
  "province_id": "12",
  "district_id": "1201",
  "commune_id": "120101"
}
```
