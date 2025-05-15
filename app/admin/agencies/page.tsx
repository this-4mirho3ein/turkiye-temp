import { getAgencies } from "@/components/admin/data/agency-actions";
import AgenciesPageClient from "@/components/admin/agencies/AgenciesPageClient";

export default async function AgenciesPage() {
  // Fetch initial agencies data from the server action
  const initialAgencies = await getAgencies();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">مدیریت آژانس‌ها</h1>
      </div>

      <AgenciesPageClient initialAgencies={initialAgencies} />
    </div>
  );
}
