import type { IProvince } from "../types/geography";
import useGeography from "../hooks/useGeography";
import DistrictList from "./DistrictList";
import { useState } from "react";

function ProvinceList() {
  const { provinces, districts, fetchDistricts } = useGeography();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="p-4 flex gap-2">
      <div className="">
        <h1 className="text-2xl font-bold mb-4">Provinces</h1>
        {provinces?.length > 0 ? (
          provinces?.map((province: IProvince) => (
            <div
              key={province.id}
              className={`mb-2  p-2 rounded-md hover:bg-gray-100 cursor-pointer hover:shadow-md transition-shadow ${selectedId === province.id ? "bg-blue-100" : "bg-gray-50"}`}
              onClick={() => {
                setSelectedId(province.id);
                fetchDistricts(province.id);
              }}
            >
              <span>{province.name_en}</span>
              <br />
              <span>{province.name_km}</span>
              {province.capital_city ? (
                <>
                  <br />
                  <span>Capital: {province.capital_city}</span>
                </>
              ) : null}
            </div>
          ))
        ) : (
          <span>No provinces found.</span>
        )}
      </div>
      <div className="flex flex-col  gap-2">
        <h1 className="text-2xl font-bold mb-4">Districts</h1>
        {districts?.length > 0 && <DistrictList districts={districts} />}
      </div>
    </div>
  );
}

export default ProvinceList;
