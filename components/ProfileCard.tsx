import Link from "next/link";
import { initials, prettyDiet, prettyHeight } from "@/lib/format";
import type { Profile } from "@/lib/matching/types";
import { StatusPill } from "./StatusPill";

/** Why: a dense card is how matchmakers scan a book between calls. */
export function ProfileCard({
  profile,
  href,
}: {
  profile: Profile;
  href?: string;
}) {
  const inner = (
    <article className="h-full rounded-3xl border border-rose-100 bg-white p-5 shadow-[0_8px_30px_rgba(120,70,70,0.05)] transition hover:-translate-y-0.5 hover:border-rose-200">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 font-serif text-lg text-rose-800">
            {initials(profile)}
          </div>
          <div>
            <h3 className="font-serif text-lg text-stone-900">
              {profile.firstName} {profile.lastName}
            </h3>
            <p className="text-sm text-stone-500">
              {profile.age} · {profile.city} · {profile.community}
            </p>
          </div>
        </div>
        <StatusPill status={profile.status} />
      </div>
      <p className="mt-4 line-clamp-3 text-sm leading-6 text-stone-600">{profile.bio}</p>
      <dl className="mt-4 grid grid-cols-2 gap-2 text-xs text-stone-500">
        <div>{profile.education}</div>
        <div>{profile.occupation}</div>
        <div>{prettyDiet(profile.diet)}</div>
        <div>{prettyHeight(profile.heightCm)}</div>
      </dl>
    </article>
  );

  if (!href) return inner;
  return (
    <Link href={href} className="block h-full">
      {inner}
    </Link>
  );
}
