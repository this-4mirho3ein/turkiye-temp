import React from "react";

interface RegionManagerProps {
  userData?: any;
}

export default function RegionManager({ userData }: RegionManagerProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">داشبورد مدیر منطقه</h2>
      <p className="text-gray-600">
        خوش آمدید، شما دسترسی به بخش‌های مدیریتی منطقه خود را دارید.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-blue-700 font-medium">املاک منطقه</h3>
          <p className="text-sm text-gray-600 mt-2">
            مدیریت املاک منطقه تحت نظارت شما
          </p>
        </div>
        <div className="bg-amber-50 p-4 rounded-lg">
          <h3 className="text-amber-700 font-medium">گزارش عملکرد</h3>
          <p className="text-sm text-gray-600 mt-2">
            مشاهده گزارش عملکرد مشاوران منطقه
          </p>
        </div>
      </div>
    </div>
  );
}
