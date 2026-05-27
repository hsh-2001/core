# Temple APIs

Base path: `/api/temples`

Temple responses include `mapUrl` when `latitude` and `longitude` are available.

## Create Temple

```http
POST /api/temples
```

### Body

```json
{
  "nameEn": "Angkor Wat",
  "nameKm": "អង្គរវត្ត",
  "description": "Temple description",
  "imageUrl": "https://example.com/angkor.jpg",
  "provinceId": "17",
  "districtId": "1702",
  "communeId": "170201",
  "villageId": "17020101",
  "latitude": 13.4125,
  "longitude": 103.867
}
```

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `nameEn` | string | Yes | English name. |
| `nameKm` | string | No | Khmer name. |
| `description` | string | No | Temple description. |
| `imageUrl` | string | No | Public image URL. |
| `provinceId` | string | No | Province ID. |
| `districtId` | string | No | District ID. |
| `communeId` | string | No | Commune ID. |
| `villageId` | string | No | Village ID. |
| `latitude` | number or string | No | Must be numeric when provided. |
| `longitude` | number or string | No | Must be numeric when provided. |

### Response

Returns `201`.

```json
{
  "success": true,
  "message": "Temple created successfully",
  "data": {
    "id": 1,
    "nameEn": "Angkor Wat",
    "nameKm": "អង្គរវត្ត",
    "description": "Temple description",
    "imageUrl": "https://example.com/angkor.jpg",
    "provinceId": "17",
    "districtId": "1702",
    "communeId": "170201",
    "villageId": "17020101",
    "latitude": 13.4125,
    "longitude": 103.867,
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=13.4125,103.867"
  }
}
```

## List Temples

```http
GET /api/temples?q=angkor&provinceId=17&limit=20&offset=0
```

### Query Parameters

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| `q` | string | No | Search text. |
| `provinceId` | string | No | Filter by province. |
| `districtId` | string | No | Filter by district. |
| `communeId` | string | No | Filter by commune. |
| `villageId` | string | No | Filter by village. |
| `limit` | string | No | Page size. |
| `offset` | string | No | Row offset. |

## Get Temple By ID

```http
GET /api/temples/:id
```

### Parameters

| Name | In | Type | Required |
| --- | --- | --- | --- |
| `id` | path | number | Yes |

Invalid IDs return `400`. Missing temples return `404`.
