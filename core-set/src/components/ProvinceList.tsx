import type { IProvince } from "../types/geography";
import useGeography from "../hooks/useGeography";

function ProvinceList() {
  const { provinces } = useGeography();

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
