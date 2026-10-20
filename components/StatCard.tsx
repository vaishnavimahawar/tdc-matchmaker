/** Why: the home view should answer "how busy is the desk today?" in one glance. */
export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: number | string;
  hint: string;
}) {
  return (
    <article className="rounded-3xl border border-rose-100 bg-white p-5">
      <p className="text-sm text-stone-500">{label}</p>
      <p className="mt-2 font-serif text-3xl text-rose-800">{value}</p>
      <p className="mt-2 text-xs text-stone-400">{hint}</p>
    </article>
  );
}
