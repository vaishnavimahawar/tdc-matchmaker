"use client";

import { useRouter } from "next/navigation";
import { displayName, initials, prettyMaritalStatus } from "@/lib/format";
import { StatusPill } from "@/components/StatusPill";
import type { Profile } from "@/lib/matching/types";

/** Why: interactive table allows instant navigation to any customer's biodata with clear hover feedback. */
export function CustomerTable({ profiles }: { profiles: Profile[] }) {
  const router = useRouter();

  if (profiles.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-rose-200 bg-white p-12 text-center text-stone-500">
        No customers assigned to this desk yet.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-rose-100 bg-white shadow-[0_8px_30px_rgba(120,70,70,0.04)]">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-stone-600">
          <thead className="border-b border-rose-100 bg-[#FAF4ED] text-xs font-semibold uppercase tracking-wider text-stone-500">
            <tr>
              <th scope="col" className="px-6 py-4">Name</th>
              <th scope="col" className="px-6 py-4">Age</th>
              <th scope="col" className="px-6 py-4">City</th>
              <th scope="col" className="px-6 py-4">Marital Status</th>
              <th scope="col" className="px-6 py-4">Status Tag</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rose-50">
            {profiles.map((profile) => (
              <tr
                key={profile.id}
                onClick={() => router.push(`/profiles/${profile.id}`)}
                className="group cursor-pointer transition hover:bg-rose-50/60"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    router.push(`/profiles/${profile.id}`);
                  }
                }}
              >
                <td className="px-6 py-4 font-medium text-stone-900">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-100 font-serif text-sm text-rose-800 transition group-hover:bg-rose-200">
                      {initials(profile)}
                    </div>
                    <div>
                      <p className="font-serif text-base font-medium text-stone-900 transition group-hover:text-rose-800">
                        {displayName(profile)}
                      </p>
                      <p className="text-xs text-stone-400">{profile.community}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-stone-700">{profile.age}</td>
                <td className="px-6 py-4 text-stone-700">{profile.city}</td>
                <td className="px-6 py-4 text-stone-700">
                  {prettyMaritalStatus(profile.maritalStatus)}
                </td>
                <td className="px-6 py-4">
                  <StatusPill status={profile.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
