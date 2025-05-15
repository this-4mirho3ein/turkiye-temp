import React from "react";

interface AccessDeniedProps {
  onRequestAccess?: () => void;
}

export default function AccessDenied() {
  return (
    <div className="text-center py-10">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        شما مجوز دسترسی به این بخش را ندارید
      </h2>
      <p className="text-gray-600 max-w-md mx-auto">
        برای دسترسی به پنل مدیریت املاک، باید به عنوان مشاور املاک، مدیر منطقه
        یا مدیر آژانس در سیستم ثبت شده باشید.
      </p>
    </div>
  );
}
