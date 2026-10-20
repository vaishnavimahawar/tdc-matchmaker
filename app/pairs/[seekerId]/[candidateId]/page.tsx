import Link from "next/link";
import { notFound } from "next/navigation";
import { MatchScoreBadge } from "@/components/MatchScoreBadge";
import { RationalePanel } from "@/components/RationalePanel";
import { ScoreBreakdown } from "@/components/ScoreBreakdown";
import { ShortlistButton } from "@/components/ShortlistButton";
import { getPool, getProfileById, getProfiles } from "@/lib/data/profiles";
import { displayName, prettyDiet } from "@/lib/format";
import { rankMatches, scoreMatch } from "@/lib/matching";
import { pairKey } from "@/lib/shortlist";
import type { Profile } from "@/lib/matching/types";

/** Why: each person on the pair page should still deep-link back to their full biodata. */
function MiniProfile({ profile }: { profile: Profile }) {
  return (
    <Link
      href={`/profiles/${profile.id}`}
      className="block rounded-3xl border border-rose-100 bg-white p-5 hover:border-rose-200"
    >
      <h2 className="font-serif text-2xl text-stone-900">{displayName(profile)}</h2>
      <p className="mt-1 text-sm text-stone-500">
        {profile.age} · {profile.city} · {profile.community}
      </p>
      <p className="mt-3 text-sm leading-6 text-stone-600">{profile.bio}</p>
      <p className="mt-3 text-xs text-stone-400">
        {profile.education} · {prettyDiet(profile.diet)} · {profile.familyType}
      </p>
    </Link>
  );
}

/** Why: prerender top eligible candidate pairings so client pairs open instantly. */
export function generateStaticParams() {
  const seekers = getProfiles();
  const pool = getPool();
  const params: { seekerId: string; candidateId: string }[] = [];
  for (const seeker of seekers) {
    const topMatches = rankMatches(seeker, pool).slice(0, 4);
    for (const match of topMatches) {
      params.push({ seekerId: seeker.id, candidateId: match.candidate.id });
    }
  }
  return params;
}

/** Why: the pair page is the working surface for a call — score, caveats, then talking points. */
export default async function PairPage({
  params,
}: {
  params: Promise<{ seekerId: string; candidateId: string }>;
}) {
  const { seekerId, candidateId } = await params;
  const seeker = getProfileById(seekerId);
  const candidate = getProfileById(candidateId);
  if (!seeker || !candidate) notFound();

  const result = scoreMatch(seeker, candidate);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-rose-700">Pair view</p>
          <h1 className="mt-2 font-serif text-4xl text-stone-900">
            {seeker.firstName} and {candidate.firstName}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <MatchScoreBadge result={result} />
          {result.eligible ? <ShortlistButton pairKey={pairKey(seeker.id, candidate.id)} /> : null}
        </div>
      </div>

      {!result.eligible ? (
        <p className="rounded-2xl bg-stone-100 px-4 py-3 text-sm text-stone-600">
          {result.knockouts.map((item) => item.reason).join(" ")}
        </p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <MiniProfile profile={seeker} />
        <MiniProfile profile={candidate} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <section className="rounded-3xl border border-rose-100 bg-white p-6">
          <h2 className="mb-4 font-serif text-xl text-stone-900">Why this score</h2>
          <ScoreBreakdown result={result} />
        </section>
        {result.eligible ? (
          <RationalePanel seekerId={seeker.id} candidateId={candidate.id} />
        ) : (
          <section className="rounded-3xl border border-rose-100 bg-white p-6 text-sm text-stone-500">
            Talking points are hidden for ineligible pairs.
          </section>
        )}
      </div>
    </div>
  );
}
