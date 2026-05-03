export default function StatusPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        Status lucrare
      </p>

      <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">
        Verifică statusul reparației sau cererii
      </h1>

      <p className="mt-4 text-slate-700">
        Introdu codul unic primit pe email pentru a vedea statusul actual.
        Nu este nevoie de cont client.
      </p>

      <form action="/status/lookup" className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
        <label htmlFor="trackingId" className="block text-sm font-medium text-slate-700">
          Cod tracking
        </label>

        <input
          id="trackingId"
          name="trackingId"
          type="text"
          placeholder="Exemplu: REP-2026-8F4K2Q"
          required
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-950 outline-none focus:border-slate-900"
        />

        <button
          type="submit"
          className="mt-4 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
        >
          Verifică statusul
        </button>
      </form>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
        Din motive de confidențialitate, pagina de status afișează doar informații
        generale despre lucrare sau cerere. Datele personale, notele interne și
        detaliile sensibile nu sunt afișate public.
      </div>
    </main>
  );
}
