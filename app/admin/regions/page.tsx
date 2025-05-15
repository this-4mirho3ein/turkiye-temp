import RegionsPageClient from "@/components/admin/regions/RegionsPageClient";

export default async function RegionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">مدیریت مناطق</h1>
      </div>

      <RegionsPageClient />
    </div>
  );
}
