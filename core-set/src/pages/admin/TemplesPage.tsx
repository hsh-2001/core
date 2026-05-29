import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import TemplesSubMenu from "../../components/TemplesSubMenu";
import useGeography from "../../hooks/useGeography";
import useTemples from "../../hooks/useTemples";
import type { Temple, TempleQuery } from "../../types/temple";

const cleanQuery = (query: TempleQuery): TempleQuery => {
  const cleaned = Object.fromEntries(
    Object.entries(query).filter(([, value]) => value && value.trim() !== ""),
  ) as TempleQuery;

  return {
    ...cleaned,
    limit: cleaned.limit || "20",
    offset: cleaned.offset || "0",
  };
};

function TemplesPage() {
  const { temples, loading, error, fetchTemples, clearFeedback } = useTemples();
  const { provinces } = useGeography();
  const [filters, setFilters] = useState<TempleQuery>({ q: "", provinceId: "", limit: "20", offset: "0" });

  const handleFilterChange = (key: keyof TempleQuery, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearFeedback();
    void fetchTemples(cleanQuery(filters));
  };

  const handleReset = () => {
    const nextFilters = { q: "", provinceId: "", districtId: "", communeId: "", villageId: "", limit: "20", offset: "0" };
    setFilters(nextFilters);
    clearFeedback();
    void fetchTemples(cleanQuery(nextFilters));
  };

  return (
    <main className="w-full bg-gray-100 p-4 text-gray-900 md:p-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-4">
        <header className="bg-white p-5 text-left">
          <p className="text-sm font-medium uppercase tracking-wide text-indigo-600">Admin</p>
          <h1 className="m-0 text-2xl font-bold text-gray-950 md:text-3xl">Temples</h1>
          <p className="mt-2 max-w-3xl text-sm text-gray-600">
            Search and browse temple records. Use the submenu to create new records.
          </p>
        </header>

        <TemplesSubMenu />

        {error ? (
          <div className="border border-red-200 bg-red-50 px-4 py-3 text-left text-sm text-red-700">{error}</div>
        ) : null}

        <section className="border border-gray-200 bg-white text-left">
          <div className="border-b border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-950">Temple Search</h2>
            <p className="text-sm text-gray-500">GET /api/temples</p>
          </div>

          <form className="grid grid-cols-1 gap-3 border-b border-gray-200 p-4 md:grid-cols-4" onSubmit={handleSearch}>
            <label className="md:col-span-2">
              <span className="text-sm font-medium text-gray-700">Search</span>
              <input
                value={filters.q ?? ""}
                placeholder="Name in English or Khmer"
                onChange={(event) => handleFilterChange("q", event.target.value)}
              />
            </label>
            <label>
              <span className="text-sm font-medium text-gray-700">Province</span>
              <select
                className="mt-1 h-8 w-full rounded-md border border-gray-300 px-2 text-sm outline-none focus:border-indigo-500 focus:ring-[0.5px] focus:ring-indigo-500"
                value={filters.provinceId ?? ""}
                onChange={(event) => handleFilterChange("provinceId", event.target.value)}
              >
                <option value="">All provinces</option>
                {provinces.map((province) => (
                  <option key={province.id} value={province.id}>
                    {province.name_en}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="text-sm font-medium text-gray-700">District ID</span>
              <input value={filters.districtId ?? ""} onChange={(event) => handleFilterChange("districtId", event.target.value)} />
            </label>
            <label>
              <span className="text-sm font-medium text-gray-700">Commune ID</span>
              <input value={filters.communeId ?? ""} onChange={(event) => handleFilterChange("communeId", event.target.value)} />
            </label>
            <label>
              <span className="text-sm font-medium text-gray-700">Village ID</span>
              <input value={filters.villageId ?? ""} onChange={(event) => handleFilterChange("villageId", event.target.value)} />
            </label>
            <label>
              <span className="text-sm font-medium text-gray-700">Limit</span>
              <input value={filters.limit ?? "20"} onChange={(event) => handleFilterChange("limit", event.target.value)} />
            </label>
            <label>
              <span className="text-sm font-medium text-gray-700">Offset</span>
              <input value={filters.offset ?? "0"} onChange={(event) => handleFilterChange("offset", event.target.value)} />
            </label>
            <div className="flex items-end gap-2 md:col-span-4">
              <button
                type="submit"
                className="h-10 rounded-md bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Search
              </button>
              <button
                type="button"
                className="h-10 rounded-md border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                onClick={handleReset}
              >
                Reset
              </button>
              <Link
                to="/admin/temples/create"
                className="h-10 rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700"
              >
                Create Temple
              </Link>
              <span className="ml-auto text-sm text-gray-500">
                {loading.list ? "Loading..." : `${temples.length} results`}
              </span>
            </div>
          </form>

          <div className="p-4">
            {temples.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                {temples.map((temple) => (
                  <TempleResult key={temple.id} temple={temple} />
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-gray-300 px-4 py-10 text-center text-sm text-gray-500">
                {loading.list ? "Loading temples..." : "No temples found."}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function TempleResult({ temple }: { temple: Temple }) {
  return (
    <Link
      to={`/admin/temples/${temple.id}`}
      className="flex min-h-40 gap-3 rounded-md border border-gray-200 bg-gray-50 p-3 text-left transition hover:border-gray-300 hover:bg-gray-100"
    >
      {temple.imageUrl ? (
        <img
          src={temple.imageUrl}
          alt={temple.nameEn}
          className="h-28 w-28 shrink-0 rounded-md bg-gray-200 object-cover"
        />
      ) : (
        <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-md bg-gray-200 text-xs text-gray-500">No image</div>
      )}
      <span className="min-w-0">
        <span className="block text-base font-semibold text-gray-950">{temple.nameEn}</span>
        {temple.nameKm ? <span className="block text-sm text-gray-600">{temple.nameKm}</span> : null}
        <span className="mt-2 block text-xs text-gray-500">ID {temple.id}</span>
        <span className="mt-1 block text-xs text-gray-500">
          Province {temple.provinceId || "-"} | District {temple.districtId || "-"}
        </span>
        {temple.description ? <span className="mt-2 line-clamp-2 block text-sm text-gray-600">{temple.description}</span> : null}
      </span>
    </Link>
  );
}

export default TemplesPage;
