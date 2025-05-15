import React from "react";

interface RealEstateAgentProps {
  userData?: any;
}

export default function RealEstateAgent({ userData }: RealEstateAgentProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">داشبورد مشاور املاک</h2>
      <p className="text-gray-600">
        خوش آمدید، شما می‌توانید املاک و مشتریان خود را مدیریت کنید.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="bg-indigo-50 p-4 rounded-lg">
          <h3 className="text-indigo-700 font-medium">املاک من</h3>
          <p className="text-sm text-gray-600 mt-2">
            مدیریت املاک ثبت شده توسط شما
          </p>
        </div>
        <div className="bg-rose-50 p-4 rounded-lg">
          <h3 className="text-rose-700 font-medium">مشتریان</h3>
          <p className="text-sm text-gray-600 mt-2">مدیریت لیست مشتریان شما</p>
        </div>
      </div>
    </div>
  );
}
