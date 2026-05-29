import { useEffect, useState } from "react";
import geoApi from "../api/geo.api";
import type { IProvince } from "../types/geography";

function ProvinceList() {
  const [provinces, setProvinces] = useState<IProvince[]>([]);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await geoApi.callGetProvinces();
        if (response.status === 200) {
          console.log("Provinces fetched successfully:", response.data.data);
          setProvinces(response.data.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchProvinces();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Provinces</h1>
      <div className="">
        {provinces?.length > 0 ? (
          provinces?.map((province: IProvince) => (
            <div
              key={province.id}
              className="mb-2 bg-gray-50 p-2 rounded-md hover:bg-gray-100 cursor-pointer hover:shadow-md transition-shadow"
            >
              <span>{province.name_en}</span>
              <br />
              <span>{province.name_km}</span>
            </div>
          ))
        ) : (
          <span>No provinces found.</span>
        )}
      </div>
    </div>
  );
}

export default ProvinceList;
