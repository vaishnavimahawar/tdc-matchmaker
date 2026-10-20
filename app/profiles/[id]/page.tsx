import { notFound } from "next/navigation";
import { StatusPill } from "@/components/StatusPill";
import { SuggestedMatches } from "@/components/SuggestedMatches";
import {
  getOppositeGenderPool,
  getProfileById,
  getProfiles,
} from "@/lib/data/profiles";
import { displayName, initials, prettyDiet, prettyHeight } from "@/lib/format";
import { rankMatches } from "@/lib/matching";

/** Why: the book is finite JSON, so we can prerender every biodata page. */
export function generateStaticParams() {
  return getProfiles().map((profile) => ({ id: profile.id }));
}

/** Why: every suggestion is anchored to one client so the score has a point of view. */
export default async function ProfileDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = getProfileById(id);
  if (!profile) notFound();

  /** Why: matching draws from the dedicated 120 opposite-gender candidate pool. */
  const matches = rankMatches(profile, getOppositeGenderPool(profile.gender)).slice(0, 10);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-3xl border border-rose-100 bg-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 font-serif text-2xl text-rose-800">
              {initials(profile)}
            </div>
            <div>
              <h1 className="font-serif text-3xl text-stone-900">{displayName(profile)}</h1>
              <p className="text-stone-500">
                {profile.age} · {prettyHeight(profile.heightCm)} · {profile.city}, {profile.state}
              </p>
            </div>
          </div>
          <StatusPill status={profile.status} />
        </div>

        <p className="mt-6 leading-7 text-stone-700">{profile.bio}</p>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2 text-sm">
          <div>
            <dt className="text-stone-400">Community</dt>
            <dd>{profile.community}{profile.gotra ? ` · ${profile.gotra}` : ""}</dd>
          </div>
          <div>
            <dt className="text-stone-400">Language</dt>
            <dd>{profile.motherTongue}</dd>
          </div>
          <div>
            <dt className="text-stone-400">Education</dt>
            <dd>{profile.education}</dd>
          </div>
          <div>
            <dt className="text-stone-400">Work</dt>
            <dd>{profile.occupation}</dd>
          </div>
          <div>
            <dt className="text-stone-400">Diet / family</dt>
            <dd>
              {prettyDiet(profile.diet)} · {profile.familyType}
            </dd>
          </div>
          <div>
            <dt className="text-stone-400">Values</dt>
            <dd className="capitalize">{profile.values}</dd>
          </div>
        </dl>

        <div className="mt-6 rounded-2xl bg-[#FBF6F0] p-4 text-sm leading-6 text-stone-600">
          <p className="text-xs uppercase tracking-wide text-rose-700">Matchmaker notes</p>
          <p className="mt-1">{profile.matchmakerNotes}</p>
        </div>
      </section>

      <SuggestedMatches seeker={profile} matches={matches} />
    </div>
  );
}
