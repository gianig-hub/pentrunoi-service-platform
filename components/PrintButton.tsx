"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white print:hidden"
    >
      Print / Save as PDF
    </button>
  );
}
