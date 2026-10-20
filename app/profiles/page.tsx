import { ProfileFilters } from "@/components/ProfileFilters";
import { getProfiles } from "@/lib/data/profiles";

/** Why: the book is the matchmaker's working list, not a marketing directory. */
export default function ProfilesPage() {
  const profiles = getProfiles();

  return (
    <div>
      <h1 className="font-serif text-4xl text-stone-900">The book</h1>
      <p className="mt-2 mb-8 max-w-2xl text-stone-600">
        Sixteen demo profiles across communities. Filter, open a person, and rank the rest of the book against them.
      </p>
      <ProfileFilters profiles={profiles} />
    </div>
  );
}
