import { prettyStatus } from "@/lib/format";
import type { Profile } from "@/lib/matching/types";

/** Why: pipeline state should be visible on every card without opening the profile. */
export function StatusPill({ status }: { status: Profile["status"] }) {
  const tone =
    status === "intro_pending"
      ? "bg-amber-100 text-amber-900"
      : status === "on_hold"
        ? "bg-stone-200 text-stone-600"
        : "bg-emerald-50 text-emerald-800";

  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${tone}`}>
      {prettyStatus(status)}
    </span>
  );
}
