import { getAdminAgencies } from '@/controllers/makeRequest';
import AgenciesPageClient from '@/components/admin/agencies/AgenciesPageClient';

// Define the expected response type to match AgenciesPageClient props
interface AgenciesResponse {
  success: boolean;
  data: {
    data: any[];
    count: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  status: number;
  message?: string;
}

async function AgenciesPage() {
  // Fetch agencies data server-side to have immediate data on page load
  const apiResponse = await getAdminAgencies();
  
  // Transform the ApiResponse to match the expected AgenciesResponse type
  const agenciesData: AgenciesResponse = {
    success: apiResponse.success,
    data: apiResponse.data || { data: [], count: 0, page: 1, limit: 10, totalPages: 0 },
    status: apiResponse.status || 200,
    message: apiResponse.message
  };
  
  return (
    <div className="p-6 font-iranyekanx" dir="rtl">
      <AgenciesPageClient initialData={agenciesData} />
    </div>
  );
}

export default AgenciesPage;
