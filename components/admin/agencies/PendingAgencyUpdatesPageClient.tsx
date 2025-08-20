"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  getPendingAgencyProfileUpdates,
  reviewAgencyProfileUpdate,
} from "@/controllers/makeRequest";
import mainConfig from "@/configs/mainConfig";
import Image from "next/image";
import { HiRefresh, HiCheck, HiX, HiChatAlt2 } from "react-icons/hi";

type Id = string;

type UserLite = {
  _id: Id;
  firstName?: string;
  lastName?: string;
  phone?: string;
};

type MediaLite = { _id: Id; fileName: string } | null | undefined;

type PendingAgencyItem = {
  _id: Id;
  name: string;
  owner?: UserLite;
  submittedAt?: string;
  submittedBy?: Id | UserLite;
  current: {
    phone?: string;
    description?: string;
    logo?: MediaLite;
  };
  pending: {
    phone?: string;
    description?: string;
    logo?: MediaLite;
  };
};

type Pagination = { page: number; limit: number; total: number; pages: number };

export default function PendingAgencyUpdatesPageClient() {
  const [items, setItems] = useState<PendingAgencyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [actionBusyId, setActionBusyId] = useState<Id | null>(null);
  const [adminMessageById, setAdminMessageById] = useState<Record<Id, string>>(
    {}
  );

  const fetchItems = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);
      const res = await getPendingAgencyProfileUpdates({ page, limit });
      if (res.success && res.data) {
        const data = res.data.data || res.data.items || [];
        const pg =
          res.data.pagination ||
          res.data.data?.pagination ||
          ({ page, limit, total: data.length, pages: 1 } as Pagination);
        setItems(Array.isArray(data?.items) ? data.items : data);
        setPagination(pg);
      } else {
        setItems([]);
        setPagination({ page, limit, total: 0, pages: 1 });
        setError(res.message || "خطا در دریافت درخواست‌ها");
      }
    } catch (e: any) {
      setError(e?.message || "خطا در دریافت درخواست‌ها");
      setItems([]);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [page, limit]);

  const onApproveReject = async (
    agencyId: Id,
    approve: boolean,
    adminMessage?: string
  ) => {
    try {
      setActionBusyId(agencyId);
      const res = await reviewAgencyProfileUpdate({
        agencyId,
        approve,
        adminMessage,
      });
      if (res.success) {
        // Remove item from list
        setItems((prev) => prev.filter((i) => i._id !== agencyId));
      } else {
        alert(res.message || "عملیات ناموفق بود");
      }
    } catch (e: any) {
      alert(e?.message || "عملیات ناموفق بود");
    } finally {
      setActionBusyId(null);
    }
  };

  const header = useMemo(
    () => (
      <div className="mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="mb-2 text-2xl font-bold text-gray-800">
              درخواست‌های ویرایش پروفایل آژانس
            </h1>
            <div className="flex items-center text-sm text-gray-500">
              <a
                href="/admin"
                className="transition-colors hover:text-purple-600"
              >
                داشبورد
              </a>
              <span className="mx-2">/</span>
              <span className="text-purple-600">درخواست‌های پروفایل آژانس</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchItems(true)}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <HiRefresh
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">بروزرسانی</span>
            </button>
          </div>
        </div>
      </div>
    ),
    [loading]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container px-4 py-8 mx-auto">
        {header}

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-600">
            {pagination?.total || items.length} مورد در انتظار بررسی
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">تعداد در صفحه:</span>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="relative z-10 px-2 py-1 text-sm border border-gray-200 rounded"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-800 border border-red-200 rounded-lg bg-red-50">
            <p className="text-lg font-medium">{error}</p>
            <button
              onClick={() => fetchItems(true)}
              className="px-4 py-2 mt-4 text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
            >
              تلاش مجدد
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="py-12 text-center">
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              موردی یافت نشد
            </h3>
            <p className="mb-4 text-gray-600">درخواستی برای بررسی موجود نیست</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((a) => {
              const submittedAt = a.submittedAt
                ? new Date(a.submittedAt).toLocaleString("fa-IR")
                : "";
              const pendingPhone = a.pending?.phone ?? "—";
              const currentPhone = a.current?.phone ?? "—";
              const pendingDesc = a.pending?.description ?? "";
              const currentDesc = a.current?.description ?? "";
              const pendingLogo = a.pending?.logo as any;
              const currentLogo = a.current?.logo as any;

              return (
                <div
                  key={a._id}
                  className="bg-white border border-gray-200 rounded-xl p-4 md:p-5 shadow-sm"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-gray-800 text-lg">
                          {a.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          ثبت: {submittedAt}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Phone */}
                        <div className="p-3 border border-gray-100 rounded-lg">
                          <div className="text-xs text-gray-500 mb-1">تلفن</div>
                          <div className="text-sm text-gray-700">
                            <span className="text-gray-500">فعلی: </span>
                            <span>{currentPhone}</span>
                          </div>
                          <div className="text-sm text-gray-700 mt-1">
                            <span className="text-gray-500">در انتظار: </span>
                            <span className="font-medium">
                              {pendingPhone || "تغییر نکرده"}
                            </span>
                          </div>
                        </div>

                        {/* Description */}
                        <div className="p-3 border border-gray-100 rounded-lg col-span-1 md:col-span-2">
                          <div className="text-xs text-gray-500 mb-1">
                            توضیحات
                          </div>
                          <div className="text-sm text-gray-700">
                            <span className="text-gray-500">فعلی: </span>
                            <span>{currentDesc || "—"}</span>
                          </div>
                          <div className="text-sm text-gray-700 mt-1">
                            <span className="text-gray-500">در انتظار: </span>
                            <span className="font-medium">
                              {pendingDesc || "تغییر نکرده"}
                            </span>
                          </div>
                        </div>

                        {/* Logos */}
                        <div className="p-3 border border-gray-100 rounded-lg col-span-1 md:col-span-3">
                          <div className="text-xs text-gray-500 mb-2">لوگو</div>
                          <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">
                                فعلی
                              </span>
                              <div className="w-14 h-14 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                                {currentLogo?._id ? (
                                  <Image
                                    alt="current logo"
                                    width={56}
                                    height={56}
                                    src={`${mainConfig.imageUploadServer}/${currentLogo._id}`}
                                    className="object-cover w-full h-full"
                                  />
                                ) : (
                                  <div className="text-gray-400 text-xs">—</div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">
                                در انتظار
                              </span>
                              <div className="w-14 h-14 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                                {pendingLogo?._id ? (
                                  <Image
                                    alt="pending logo"
                                    width={56}
                                    height={56}
                                    src={`${mainConfig.fileServer}/${pendingLogo._id}`}
                                    className="object-cover w-full h-full"
                                  />
                                ) : (
                                  <div className="text-gray-400 text-xs">
                                    تغییر نکرده
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="w-full md:w-80">
                      <label className="text-sm text-gray-600 flex items-center gap-2 mb-2">
                        <HiChatAlt2 className="w-4 h-4" /> پیام مدیر (اختیاری)
                      </label>
                      <textarea
                        className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        rows={3}
                        placeholder="در صورت نیاز توضیحی برای مالک آژانس بنویسید"
                        value={adminMessageById[a._id] || ""}
                        onChange={(e) =>
                          setAdminMessageById((prev) => ({
                            ...prev,
                            [a._id]: e.target.value,
                          }))
                        }
                      />
                      <div className="flex items-center gap-2 mt-3">
                        <button
                          onClick={() =>
                            onApproveReject(
                              a._id,
                              true,
                              adminMessageById[a._id]
                            )
                          }
                          disabled={actionBusyId === a._id}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
                        >
                          <HiCheck className="w-4 h-4" /> تایید
                        </button>
                        <button
                          onClick={() =>
                            onApproveReject(
                              a._id,
                              false,
                              adminMessageById[a._id]
                            )
                          }
                          disabled={actionBusyId === a._id}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
                        >
                          <HiX className="w-4 h-4" /> رد
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Pagination */}
            {(pagination?.pages || 1) > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50"
                >
                  قبلی
                </button>
                <span className="text-sm text-gray-600">
                  صفحه {page} از {pagination?.pages || 1}
                </span>
                <button
                  onClick={() =>
                    setPage((p) => Math.min(pagination?.pages || 1, p + 1))
                  }
                  disabled={page >= (pagination?.pages || 1)}
                  className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50"
                >
                  بعدی
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
