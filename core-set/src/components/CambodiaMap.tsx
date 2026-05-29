import type { GeographyLevel } from "../types/geography";

type ProvincePoint = {
  latitude: number;
  longitude: number;
  label: string;
};

const CAMBODIA_CENTER = {
  latitude: 12.5657,
  longitude: 104.991,
  label: "Cambodia",
};

const PROVINCE_POINTS: Record<string, ProvincePoint> = {
  "01": { latitude: 13.67, longitude: 102.99, label: "Banteay Meanchey" },
  "02": { latitude: 13.1, longitude: 103.2, label: "Battambang" },
  "03": { latitude: 12, longitude: 105.45, label: "Kampong Cham" },
  "04": { latitude: 12.25, longitude: 104.67, label: "Kampong Chhnang" },
  "05": { latitude: 11.45, longitude: 104.52, label: "Kampong Speu" },
  "06": { latitude: 12.72, longitude: 104.88, label: "Kampong Thom" },
  "07": { latitude: 10.61, longitude: 104.18, label: "Kampot" },
  "08": { latitude: 11.38, longitude: 105.04, label: "Kandal" },
  "09": { latitude: 11.62, longitude: 103, label: "Koh Kong" },
  "10": { latitude: 12.49, longitude: 106.02, label: "Kratie" },
  "11": { latitude: 12.45, longitude: 107.2, label: "Mondulkiri" },
  "12": { latitude: 11.56, longitude: 104.93, label: "Phnom Penh" },
  "13": { latitude: 13.8, longitude: 104.98, label: "Preah Vihear" },
  "14": { latitude: 11.49, longitude: 105.32, label: "Prey Veng" },
  "15": { latitude: 12.53, longitude: 103.92, label: "Pursat" },
  "16": { latitude: 13.74, longitude: 106.99, label: "Ratanakiri" },
  "17": { latitude: 13.36, longitude: 103.86, label: "Siem Reap" },
  "18": { latitude: 10.63, longitude: 103.5, label: "Preah Sihanouk" },
  "19": { latitude: 13.52, longitude: 105.97, label: "Stung Treng" },
  "20": { latitude: 11.08, longitude: 105.8, label: "Svay Rieng" },
  "21": { latitude: 10.99, longitude: 104.78, label: "Takeo" },
  "22": { latitude: 14.16, longitude: 103.51, label: "Oddar Meanchey" },
  "23": { latitude: 10.48, longitude: 104.32, label: "Kep" },
  "24": { latitude: 12.85, longitude: 102.61, label: "Pailin" },
  "25": { latitude: 11.89, longitude: 105.88, label: "Tboung Khmum" },
};

const getGoogleMapUrl = (queryText: string, zoom: number) => {
  const query = encodeURIComponent(queryText);

  return `https://www.google.com/maps?q=${query}&z=${zoom}&output=embed`;
};

function CambodiaMap({
  provinceId,
  selectedName,
  selectedLevel,
  searchQuery,
}: {
  provinceId: string | null;
  selectedName?: string;
  selectedLevel: GeographyLevel | null;
  searchQuery?: string;
}) {
  const selectedPoint = provinceId ? PROVINCE_POINTS[provinceId] : undefined;
  const mapPoint = selectedPoint ?? CAMBODIA_CENTER;
  const markerLabel = selectedName || selectedPoint?.label || "Cambodia";
  const zoomByLevel: Record<GeographyLevel, number> = {
    province: 9,
    district: 11,
    commune: 13,
    village: 15,
  };
  const zoom = selectedLevel ? zoomByLevel[selectedLevel] : 7;
  const mapQuery = searchQuery || `${mapPoint.latitude},${mapPoint.longitude}`;

  return (
    <section className="border border-gray-200 bg-white p-5 text-left">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-950">Google Map</h2>
          <p className="text-sm text-gray-500">
            {selectedPoint
              ? `${markerLabel} is searched on the interactive map.`
              : "Select a geography record to zoom into its province."}
          </p>
        </div>
        {selectedLevel ? (
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
            {selectedLevel}
          </span>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-md border border-gray-200 bg-gray-100">
        <iframe
          key={`${mapQuery}-${zoom}`}
          title={`Map for ${markerLabel}`}
          src={getGoogleMapUrl(mapQuery, zoom)}
          className="h-[34rem] w-full border-0 lg:h-[42rem]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
        <span>
          {searchQuery || (selectedPoint ? `Lat ${selectedPoint.latitude}, Lng ${selectedPoint.longitude}` : "Default view: Cambodia")}
        </span>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`}
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-indigo-600 hover:text-indigo-700"
        >
          Open in Google Maps
        </a>
      </div>
    </section>
  );
}

export default CambodiaMap;
