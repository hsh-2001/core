import type { IDistrict } from "../types/geography";

function DistrictList({ districts }: { districts: IDistrict[] }) {
  return (
    <div className="flex flex-col gap-2">
      {districts.map((district: IDistrict, index) => (
        <div key={index}>{district.name_en}</div>
      ))}
    </div>
  );
}

export default DistrictList;
