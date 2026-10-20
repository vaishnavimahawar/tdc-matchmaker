"use client";

import { useState } from "react";

/** Why: talking points are generated on demand so we do not spend LLM calls on every card render. */
export function RationalePanel({
  seekerId,
  candidateId,
}: {
  seekerId: string;
  candidateId: string;
}) {
  const [text, setText] = useState("");
  const [source, setSource] = useState<"llm" | "fallback" | "">("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadRationale() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/ai/rationale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seekerId, candidateId }),
      });
      const data = (await response.json()) as {
        text?: string;
        source?: "llm" | "fallback";
        error?: string;
      };
      if (!response.ok || !data.text) {
        throw new Error(data.error || "Could not write talking points");
      }
      setText(data.text);
      setSource(data.source ?? "fallback");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-3xl border border-rose-100 bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-xl text-stone-900">Talking points</h2>
          <p className="text-sm text-stone-500">
            Uses an LLM if a key is set; otherwise a rule-based brief.
          </p>
        </div>
        <button
          type="button"
          onClick={loadRationale}
          disabled={loading}
          className="rounded-full bg-rose-800 px-4 py-2 text-sm text-white hover:bg-rose-700 disabled:opacity-60"
        >
          {loading ? "Writing…" : text ? "Refresh brief" : "Write intro brief"}
        </button>
      </div>
      {source ? (
        <p className="mt-3 text-xs uppercase tracking-wide text-rose-700">
          {source === "llm" ? "From language model" : "Rule-based fallback"}
        </p>
      ) : null}
      {error ? <p className="mt-4 text-sm text-rose-700">{error}</p> : null}
      {text ? (
        <pre className="mt-4 whitespace-pre-wrap font-sans text-sm leading-6 text-stone-700">
          {text}
        </pre>
      ) : (
        <p className="mt-4 text-sm text-stone-400">
          Generate a short script before you call either family.
        </p>
      )}
    </section>
  );
}
