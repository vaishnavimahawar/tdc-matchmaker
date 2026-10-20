import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { countByMatchmakerStatus, getProfilesByMatchmaker } from "@/lib/data/profiles";
import { StatCard } from "@/components/StatCard";
import { CustomerTable } from "@/components/CustomerTable";

/** Why: the desk homepage displays the logged-in matchmaker's assigned customers and portfolio metrics. */
export default async function HomePage() {
  const user = await currentUser();
  if (!user) {
    redirect("/login");
  }

  const assignedProfiles = getProfilesByMatchmaker(user.id);
  const stats = countByMatchmakerStatus(user.id);

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm uppercase tracking-[0.2em] text-rose-700">The Desk Circle</p>
        <h1 className="mt-2 font-serif text-4xl text-stone-900">
          Good afternoon, {user.displayName}.
        </h1>
        <p className="mt-3 max-w-2xl text-stone-600">
          Here is your assigned customer book. Select any customer to view full biodata, review compatibility rankings, and prepare introduction notes.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Your assigned book"
          value={stats.total}
          hint={`${stats.women} women · ${stats.men} men`}
        />
        <StatCard label="Active" value={stats.active} hint="Ready for suggestions" />
        <StatCard label="Intro pending" value={stats.introPending} hint="Waiting on a family yes" />
        <StatCard label="On hold" value={stats.onHold} hint="Pause outreach for now" />
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-serif text-2xl text-stone-900">Assigned Customers</h2>
            <p className="mt-1 text-sm text-stone-500">
              Showing all {assignedProfiles.length} customers managed by your desk. Click any row to view biodata.
            </p>
          </div>
        </div>
        <CustomerTable profiles={assignedProfiles} />
      </section>
    </div>
  );
}
