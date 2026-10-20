"use client";

import { useMemo, useState } from "react";
import { ProfileCard } from "@/components/ProfileCard";
import type { Profile } from "@/lib/matching/types";

/** Why: filtering on the client keeps the MVP snappy with a small static book. */
export function ProfileFilters({ profiles }: { profiles: Profile[] }) {
  const [query, setQuery] = useState("");
  const [gender, setGender] = useState("all");
  const [status, setStatus] = useState("all");
  const [community, setCommunity] = useState("all");

  const communities = useMemo(
    () => [...new Set(profiles.map((p) => p.community))].sort(),
    [profiles],
  );

  const filtered = profiles.filter((profile) => {
    const haystack = `${profile.firstName} ${profile.lastName} ${profile.city} ${profile.occupation}`.toLowerCase();
    const matchesQuery = haystack.includes(query.toLowerCase());
    const matchesGender = gender === "all" || profile.gender === gender;
    const matchesStatus = status === "all" || profile.status === status;
    const matchesCommunity = community === "all" || profile.community === community;
    return matchesQuery && matchesGender && matchesStatus && matchesCommunity;
  });

  return (
    <div>
      <div className="mb-6 grid gap-3 rounded-3xl border border-rose-100 bg-white p-4 md:grid-cols-4">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search name, city, work"
          className="rounded-2xl border border-rose-100 bg-[#FBF6F0] px-3 py-2 text-sm outline-none focus:border-rose-300"
        />
        <select
          value={gender}
          onChange={(event) => setGender(event.target.value)}
          className="rounded-2xl border border-rose-100 bg-[#FBF6F0] px-3 py-2 text-sm"
        >
          <option value="all">All genders</option>
          <option value="woman">Women</option>
          <option value="man">Men</option>
        </select>
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="rounded-2xl border border-rose-100 bg-[#FBF6F0] px-3 py-2 text-sm"
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="intro_pending">Intro pending</option>
          <option value="on_hold">On hold</option>
        </select>
        <select
          value={community}
          onChange={(event) => setCommunity(event.target.value)}
          className="rounded-2xl border border-rose-100 bg-[#FBF6F0] px-3 py-2 text-sm"
        >
          <option value="all">All communities</option>
          {communities.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
      <p className="mb-4 text-sm text-stone-500">{filtered.length} profiles</p>
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((profile) => (
          <ProfileCard key={profile.id} profile={profile} href={`/profiles/${profile.id}`} />
        ))}
      </div>
    </div>
  );
}
