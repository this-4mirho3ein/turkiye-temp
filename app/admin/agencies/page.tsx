import { getAdminAgencies } from '@/controllers/makeRequest';
import AgenciesPageClient from '@/components/admin/agencies/AgenciesPageClient';

async function AgenciesPage() {
  // Fetch agencies data server-side to have immediate data on page load
  const agenciesData = await getAdminAgencies();
  
  return (
    <div className="p-6 font-iranyekanx" dir="rtl">
      <AgenciesPageClient initialData={agenciesData} />
    </div>
  );
}

export default AgenciesPage;
