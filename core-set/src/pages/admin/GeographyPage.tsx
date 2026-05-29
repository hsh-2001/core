import { useState } from "react";
import type { FormEvent } from "react";
import useGeography from "../../hooks/useGeography";
import type { GeographyItem, GeographyLevel } from "../../types/geography";

type GeographyColumnProps<T extends GeographyItem> = {
  title: string;
  items: T[];
  selectedId: string | null;
  loading: boolean;
  emptyMessage: string;
  disabledMessage?: string;
  onSelect: (id: string) => void;
};

const getItemParentLabel = (item: GeographyItem) => {
  if ("commune_id" in item) {
    return `Commune ${item.commune_id}`;
  }

  if ("district_id" in item) {
    return `District ${item.district_id}`;
  }

  if ("province_id" in item) {
    return `Province ${item.province_id}`;
  }

  if ("capital_city" in item && item.capital_city) {
    return `Capital ${item.capital_city}`;
  }

  return null;
};

const getSelectedLevel = (
  villageId: string | null,
  communeId: string | null,
  districtId: string | null,
  provinceId: string | null,
): GeographyLevel | null => {
  if (villageId) return "village";
  if (communeId) return "commune";
  if (districtId) return "district";
  if (provinceId) return "province";

  return null;
};

function GeographyColumn<T extends GeographyItem>({
  title,
  items,
  selectedId,
  loading,
  emptyMessage,
  disabledMessage,
  onSelect,
}: GeographyColumnProps<T>) {
  return (
    <section className="min-h-96 border border-gray-200 bg-white text-left">
      <div className="flex h-12 items-center justify-between border-b border-gray-200 px-4">
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
          {items.length}
        </span>
      </div>
      <div className="max-h-[34rem] overflow-y-auto p-3">
        {loading ? (
          <div className="px-2 py-8 text-center text-sm text-gray-500">Loading {title.toLowerCase()}...</div>
        ) : items.length > 0 ? (
          <div className="flex flex-col gap-2">
            {items.map((item) => {
              const parentLabel = getItemParentLabel(item);
              const isSelected = selectedId === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  className={`w-full rounded-md border px-3 py-2 text-left transition ${
                    isSelected
                      ? "border-indigo-500 bg-indigo-50 text-indigo-950"
                      : "border-gray-200 bg-gray-50 text-gray-900 hover:border-gray-300 hover:bg-gray-100"
                  }`}
                  onClick={() => onSelect(item.id)}
                >
                  <span className="block text-sm font-semibold">{item.name_en}</span>
                  <span className="block text-sm text-gray-600">{item.name_km}</span>
                  <span className="mt-1 block text-xs text-gray-500">
                    ID {item.id}
                    {parentLabel ? ` | ${parentLabel}` : ""}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="px-2 py-8 text-center text-sm text-gray-500">
            {disabledMessage ?? emptyMessage}
          </div>
        )}
      </div>
    </section>
  );
}

function GeographyPage() {
  const {
    provinces,
    districts,
    communes,
    villages,
    detail,
    selectedProvinceId,
    selectedDistrictId,
    selectedCommuneId,
    selectedVillageId,
    loading,
    error,
    fetchProvinces,
    selectProvince,
    selectDistrict,
    selectCommune,
    selectVillage,
    resetSelection,
  } = useGeography();
  const [search, setSearch] = useState("");

  const selectedLevel = getSelectedLevel(
    selectedVillageId,
    selectedCommuneId,
    selectedDistrictId,
    selectedProvinceId,
  );

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetSelection();
    void fetchProvinces(search.trim() ? { q: search.trim() } : undefined);
  };

  const handleClear = () => {
    setSearch("");
    resetSelection();
    void fetchProvinces();
  };

  return (
    <main className="w-full bg-gray-100 p-4 text-gray-900 md:p-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-4">
        <header className="flex flex-col justify-between gap-4 bg-white p-5 text-left md:flex-row md:items-end">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-indigo-600">Admin</p>
            <h1 className="m-0 text-2xl font-bold text-gray-950 md:text-3xl">Geography</h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-600">
              Browse provinces, districts, communes, villages, and detail records from the geography API.
            </p>
          </div>
          <form className="flex w-full flex-col gap-2 md:w-auto md:min-w-96 md:flex-row" onSubmit={handleSearch}>
            <input
              aria-label="Search geography"
              className="h-10 flex-1"
              placeholder="Search English or Khmer name"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <button
              type="submit"
              className="h-10 rounded-md bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Search
            </button>
            <button
              type="button"
              className="h-10 rounded-md border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              onClick={handleClear}
            >
              Reset
            </button>
          </form>
        </header>

        {error ? (
          <div className="border border-red-200 bg-red-50 px-4 py-3 text-left text-sm text-red-700">{error}</div>
        ) : null}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          <GeographyColumn
            title="Provinces"
            items={provinces}
            selectedId={selectedProvinceId}
            loading={loading.provinces}
            emptyMessage="No provinces found."
            onSelect={(id) => void selectProvince(id)}
          />
          <GeographyColumn
            title="Districts"
            items={districts}
            selectedId={selectedDistrictId}
            loading={loading.districts}
            emptyMessage="No districts found."
            disabledMessage={selectedProvinceId ? undefined : "Select a province to load districts."}
            onSelect={(id) => void selectDistrict(id)}
          />
          <GeographyColumn
            title="Communes"
            items={communes}
            selectedId={selectedCommuneId}
            loading={loading.communes}
            emptyMessage="No communes found."
            disabledMessage={selectedDistrictId ? undefined : "Select a district to load communes."}
            onSelect={(id) => void selectCommune(id)}
          />
          <GeographyColumn
            title="Villages"
            items={villages}
            selectedId={selectedVillageId}
            loading={loading.villages}
            emptyMessage="No villages found."
            disabledMessage={selectedCommuneId ? undefined : "Select a commune to load villages."}
            onSelect={(id) => void selectVillage(id)}
          />
        </div>

        <section className="border border-gray-200 bg-white p-5 text-left">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-gray-950">Detail</h2>
              <p className="text-sm text-gray-500">
                {selectedLevel ? `Selected ${selectedLevel}` : "Select a record to load detail data."}
              </p>
            </div>
            {loading.detail ? <span className="text-sm text-gray-500">Loading detail...</span> : null}
          </div>

          {detail ? (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
              {detail.province ? <DetailCard title="Province" item={detail.province} /> : null}
              {detail.district ? <DetailCard title="District" item={detail.district} /> : null}
              {detail.commune ? <DetailCard title="Commune" item={detail.commune} /> : null}
              {detail.village ? <DetailCard title="Village" item={detail.village} /> : null}
              {detail.districts ? <RelatedCount title="Districts" count={detail.districts.length} /> : null}
              {detail.communes ? <RelatedCount title="Communes" count={detail.communes.length} /> : null}
              {detail.villages ? <RelatedCount title="Villages" count={detail.villages.length} /> : null}
            </div>
          ) : (
            <div className="border border-dashed border-gray-300 px-4 py-8 text-center text-sm text-gray-500">
              No detail loaded.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function DetailCard({ title, item }: { title: string; item: GeographyItem }) {
  const parentLabel = getItemParentLabel(item);

  return (
    <article className="rounded-md border border-gray-200 bg-gray-50 p-4">
      <h3 className="text-sm font-semibold text-gray-500">{title}</h3>
      <p className="mt-2 text-base font-semibold text-gray-950">{item.name_en}</p>
      <p className="text-sm text-gray-600">{item.name_km}</p>
      <p className="mt-2 text-xs text-gray-500">
        ID {item.id}
        {parentLabel ? ` | ${parentLabel}` : ""}
      </p>
    </article>
  );
}

function RelatedCount({ title, count }: { title: string; count: number }) {
  return (
    <article className="rounded-md border border-gray-200 bg-gray-50 p-4">
      <h3 className="text-sm font-semibold text-gray-500">Related {title}</h3>
      <p className="mt-2 text-2xl font-bold text-gray-950">{count}</p>
    </article>
  );
}

export default GeographyPage;
