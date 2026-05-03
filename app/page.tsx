export default function HomePage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        pentrunoi-service-platform
      </p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950">
        Pentrunoi.ro rebuild — development version
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-slate-700">
        Scaffold ready for repair requests, public status tracking, admin workflow,
        uploads, backups, legal pages, and future service modules.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="font-semibold">Status route</h2>
          <p className="mt-2 text-sm text-slate-600">Reserved at /status.</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="font-semibold">Admin area</h2>
          <p className="mt-2 text-sm text-slate-600">Reserved at /admin.</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="font-semibold">Uploads</h2>
          <p className="mt-2 text-sm text-slate-600">Local /uploads strategy.</p>
        </div>
      </div>
    </main>
  );
}
