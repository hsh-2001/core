import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import TemplesSubMenu from "../../components/TemplesSubMenu";
import useTemples from "../../hooks/useTemples";

function TempleDetailPage() {
  const { id } = useParams();
  const { selectedTemple, loading, error, fetchTemple } = useTemples();

  useEffect(() => {
    if (!id) return;

    const timeoutId = window.setTimeout(() => {
      void fetchTemple(id);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchTemple, id]);

  return (
    <main className="w-full bg-gray-100 p-4 text-gray-900 md:p-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-4">
        <header className="bg-white p-5 text-left">
          <p className="text-sm font-medium uppercase tracking-wide text-indigo-600">Admin</p>
          <h1 className="m-0 text-2xl font-bold text-gray-950 md:text-3xl">Temple Detail</h1>
          <p className="mt-2 max-w-3xl text-sm text-gray-600">GET /api/temples/{id ?? ":id"}</p>
        </header>

        <TemplesSubMenu />

        {error ? (
          <div className="border border-red-200 bg-red-50 px-4 py-3 text-left text-sm text-red-700">{error}</div>
        ) : null}

        <section className="border border-gray-200 bg-white p-4 text-left">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-gray-950">Record</h2>
              <p className="text-sm text-gray-500">Temple ID {id}</p>
            </div>
            {loading.detail ? <span className="text-sm text-gray-500">Loading...</span> : null}
          </div>

          {selectedTemple ? (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[20rem_1fr]">
              {selectedTemple.imageUrl ? (
                <img
                  src={selectedTemple.imageUrl}
                  alt={selectedTemple.nameEn}
                  className="h-80 w-full rounded-md bg-gray-200 object-cover"
                />
              ) : (
                <div className="flex h-80 items-center justify-center rounded-md bg-gray-200 text-sm text-gray-500">No image</div>
              )}

              <div className="flex flex-col gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-950">{selectedTemple.nameEn}</h3>
                  {selectedTemple.nameKm ? <p className="text-base text-gray-600">{selectedTemple.nameKm}</p> : null}
                </div>
                {selectedTemple.description ? <p className="text-sm text-gray-700">{selectedTemple.description}</p> : null}
                <dl className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
                  <DetailValue label="Province" value={selectedTemple.provinceId} />
                  <DetailValue label="District" value={selectedTemple.districtId} />
                  <DetailValue label="Commune" value={selectedTemple.communeId} />
                  <DetailValue label="Village" value={selectedTemple.villageId} />
                  <DetailValue label="Latitude" value={selectedTemple.latitude?.toString()} />
                  <DetailValue label="Longitude" value={selectedTemple.longitude?.toString()} />
                  <DetailValue label="Created" value={new Date(selectedTemple.createdAt).toLocaleString()} />
                  <DetailValue label="Updated" value={new Date(selectedTemple.updatedAt).toLocaleString()} />
                </dl>
                <div className="flex flex-wrap gap-2">
                  <Link
                    to="/admin/temples"
                    className="inline-flex h-10 items-center rounded-md border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Back to List
                  </Link>
                  {selectedTemple.mapUrl ? (
                    <a
                      href={selectedTemple.mapUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-10 items-center rounded-md bg-gray-900 px-4 text-sm font-semibold text-white hover:bg-gray-700"
                    >
                      Open Map
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          ) : (
            <div className="border border-dashed border-gray-300 px-4 py-10 text-center text-sm text-gray-500">
              {loading.detail ? "Loading temple detail..." : "No temple detail loaded."}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function DetailValue({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="rounded-md bg-gray-50 p-3">
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-1 font-semibold text-gray-950">{value || "-"}</dd>
    </div>
  );
}

export default TempleDetailPage;
