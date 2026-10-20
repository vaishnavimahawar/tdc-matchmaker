import Link from "next/link";

/** Why: a missing biodata should feel like a quiet miss, not a broken app. */
export default function NotFound() {
  return (
    <div className="rounded-3xl border border-rose-100 bg-white p-10">
      <h1 className="font-serif text-3xl text-stone-900">That page is not in the book</h1>
      <p className="mt-3 text-stone-600">The profile or pair you opened is not in this demo dataset.</p>
      <Link href="/profiles" className="mt-6 inline-block text-rose-800 hover:underline">
        Back to the book
      </Link>
    </div>
  );
}
