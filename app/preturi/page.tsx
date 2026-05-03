const prices = [
  ["Diagnosticare laptop/calculator", "De stabilit / orientativ"],
  ["Curățare laptop praf și verificare temperaturi", "De stabilit"],
  ["Înlocuire display laptop", "În funcție de model și piesă"],
  ["Înlocuire tastatură laptop", "În funcție de model și piesă"],
  ["Upgrade SSD/RAM", "În funcție de componente"],
  ["Reinstalare/configurare sistem", "De stabilit"],
  ["Recuperare date", "Evaluare individuală"],
  ["Service prin curier", "Transportul se stabilește separat"]
];

export default function PricesPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        Prețuri
      </p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">
        Prețuri orientative service
      </h1>
      <p className="mt-4 max-w-3xl text-slate-700">
        Prețurile finale depind de diagnosticare, model, piesele necesare, urgență,
        transport și complexitatea lucrării. Valorile de aici sunt pregătite ca structură
        și trebuie completate înainte de lansarea finală.
      </p>

      <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="p-4">Serviciu</th>
              <th className="p-4">Preț</th>
            </tr>
          </thead>
          <tbody>
            {prices.map(([service, price]) => (
              <tr key={service} className="border-t border-slate-100">
                <td className="p-4 font-medium text-slate-950">{service}</td>
                <td className="p-4 text-slate-700">{price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 rounded-2xl bg-amber-50 p-5 text-sm text-amber-900">
        Prețurile trebuie verificate și completate înainte de producție. Reparația se face
        doar după confirmarea clientului, acolo unde este necesar deviz.
      </div>
    </main>
  );
}
