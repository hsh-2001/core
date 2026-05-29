import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import TemplesSubMenu from "../../components/TemplesSubMenu";
import useGeography from "../../hooks/useGeography";
import useTemples from "../../hooks/useTemples";
import type { TempleCreateInput } from "../../types/temple";

const emptyForm: TempleCreateInput = {
  nameEn: "",
  nameKm: "",
  description: "",
  imageUrl: "",
  provinceId: "",
  districtId: "",
  communeId: "",
  villageId: "",
  latitude: "",
  longitude: "",
};

function CreateTemplePage() {
  const navigate = useNavigate();
  const { provinces } = useGeography();
  const { loading, error, message, createTemple } = useTemples();
  const [form, setForm] = useState<TempleCreateInput>(emptyForm);

  const handleFormChange = (key: keyof TempleCreateInput, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const temple = await createTemple(form);

    if (temple) {
      setForm(emptyForm);
      navigate(`/admin/temples/${temple.id}`);
    }
  };

  return (
    <main className="w-full bg-gray-100 p-4 text-gray-900 md:p-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-4">
        <header className="bg-white p-5 text-left">
          <p className="text-sm font-medium uppercase tracking-wide text-indigo-600">Admin</p>
          <h1 className="m-0 text-2xl font-bold text-gray-950 md:text-3xl">Create Temple</h1>
          <p className="mt-2 max-w-3xl text-sm text-gray-600">Add a temple record through POST /api/temples.</p>
        </header>

        <TemplesSubMenu />

        {error ? (
          <div className="border border-red-200 bg-red-50 px-4 py-3 text-left text-sm text-red-700">{error}</div>
        ) : null}
        {message ? (
          <div className="border border-green-200 bg-green-50 px-4 py-3 text-left text-sm text-green-700">{message}</div>
        ) : null}

        <section className="border border-gray-200 bg-white p-4 text-left">
          <form className="grid grid-cols-1 gap-3 md:grid-cols-2" onSubmit={handleCreate}>
            <label>
              <span className="text-sm font-medium text-gray-700">English Name</span>
              <input required value={form.nameEn} onChange={(event) => handleFormChange("nameEn", event.target.value)} />
            </label>
            <label>
              <span className="text-sm font-medium text-gray-700">Khmer Name</span>
              <input value={form.nameKm ?? ""} onChange={(event) => handleFormChange("nameKm", event.target.value)} />
            </label>
            <label className="md:col-span-2">
              <span className="text-sm font-medium text-gray-700">Description</span>
              <textarea
                className="mt-1 min-h-28 w-full rounded-md border border-gray-300 px-2 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-[0.5px] focus:ring-indigo-500"
                value={form.description ?? ""}
                onChange={(event) => handleFormChange("description", event.target.value)}
              />
            </label>
            <label className="md:col-span-2">
              <span className="text-sm font-medium text-gray-700">Image URL</span>
              <input value={form.imageUrl ?? ""} onChange={(event) => handleFormChange("imageUrl", event.target.value)} />
            </label>
            <label>
              <span className="text-sm font-medium text-gray-700">Province</span>
              <select
                className="mt-1 h-8 w-full rounded-md border border-gray-300 px-2 text-sm outline-none focus:border-indigo-500 focus:ring-[0.5px] focus:ring-indigo-500"
                value={form.provinceId ?? ""}
                onChange={(event) => handleFormChange("provinceId", event.target.value)}
              >
                <option value="">No province</option>
                {provinces.map((province) => (
                  <option key={province.id} value={province.id}>
                    {province.name_en}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="text-sm font-medium text-gray-700">District ID</span>
              <input value={form.districtId ?? ""} onChange={(event) => handleFormChange("districtId", event.target.value)} />
            </label>
            <label>
              <span className="text-sm font-medium text-gray-700">Commune ID</span>
              <input value={form.communeId ?? ""} onChange={(event) => handleFormChange("communeId", event.target.value)} />
            </label>
            <label>
              <span className="text-sm font-medium text-gray-700">Village ID</span>
              <input value={form.villageId ?? ""} onChange={(event) => handleFormChange("villageId", event.target.value)} />
            </label>
            <label>
              <span className="text-sm font-medium text-gray-700">Latitude</span>
              <input value={form.latitude ?? ""} onChange={(event) => handleFormChange("latitude", event.target.value)} />
            </label>
            <label>
              <span className="text-sm font-medium text-gray-700">Longitude</span>
              <input value={form.longitude ?? ""} onChange={(event) => handleFormChange("longitude", event.target.value)} />
            </label>
            <div className="flex gap-2 md:col-span-2">
              <button
                type="submit"
                disabled={loading.create}
                className="h-10 rounded-md bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
              >
                {loading.create ? "Creating..." : "Create Temple"}
              </button>
              <button
                type="button"
                className="h-10 rounded-md border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                onClick={() => setForm(emptyForm)}
              >
                Clear
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

export default CreateTemplePage;
