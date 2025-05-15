"use client";

import { api } from "@/lib/api";
import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import Image from "next/image";
import React, { useState, useEffect } from "react";

export default function Dashboard() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const userData = await api.get(`get?tab=${selectedTab}`);
        // setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setData(null);
      }
    };

    fetchData();
  }, [selectedTab]);

  const userData = {
    user: {
      id: 12345,
      name: "صدرا آبادکار Original W",
      email: "Sadraabaddade@gmail.com",
      role: "admin",
      profile_image: "/r.jpg",
      created_at: "2023-05-10T14:30:00Z",
    },
    company: {
      id: 6789,
      name: "Tech Innovations Ltd.",
      industry: "Software",
      country: "USA",
      created_at: "2020-08-15T10:00:00Z",
    },
    account: {
      balance: 250.75,
      currency: "USD",
      last_transaction: "2024-03-28T12:45:00Z",
    },
    transactions: [
      {
        id: 1234567890123456,
        type: "deposit",
        amount: 100.0,
        currency: "USD",
        status: "completed",
        date: "2024-03-25T08:15:00Z",
        payment_method: "Credit Card",
      },
      {
        id: 2234567890123456,
        type: "withdrawal",
        amount: 50.0,
        currency: "USD",
        status: "pending",
        date: "2024-03-26T14:30:00Z",
        payment_method: "Bank Transfer",
      },
      {
        id: 3,
        type: "deposit",
        amount: 200.0,
        currency: "USD",
        status: "completed",
        date: "2024-03-20T10:00:00Z",
        payment_method: "PayPal",
      },
      {
        id: 4,
        type: "deposit",
        amount: 2000.0,
        currency: "USD",
        status: "completed",
        date: "2024-03-20T10:00:00Z",
        payment_method: "PayPal",
      },
      {
        id: 5,
        type: "deposit",
        amount: 2920.0,
        currency: "USD",
        status: "completed",
        date: "2024-03-20T10:00:00Z",
        payment_method: "PayPal",
      },
    ],
  };

  const tabs = [
    { id: "all", label: "مشخصات کلی" },
    { id: "deposits", label: "واریز های شخصی" },
    { id: "withdrawals", label: "پرداخت های شخصی" },
    { id: "teamWithdrawals", label: "پرداخت های تیمی" },
  ];

  return (
    <div className="col-span-12 lg:col-span-9">
      <div className="rounded-md bg-muted p-2  shadow-base">
        <div className="flex w-full flex-col items-center justify-center">
          <Tabs
            selectedKey={selectedTab}
            onSelectionChange={(key) => setSelectedTab(String(key))}
            aria-label="مدیریت تراکنش‌ها"
            items={tabs}
            size="sm"
            color="primary"
            // defaultSelectedKey={"deposits"}
            classNames={{
              tabList:
                "gap-2 w-full relative rounded-none p-1 border-b border-divider",
              cursor: "w-full bg-[#1a4fa0]",
              tab: "h-12",
              tabContent: "group-data-[selected=true]:text-[#fff] text-[#111]",
            }}
          >
            {(item) => (
              <Tab key={item.id} title={item.label} className="w-full">
                <Card>
                  <CardBody>
                    <div className="flex items-center justify-between px-2 gap-4 border-b pb-4">
                      <Image
                        src={userData.user.profile_image}
                        width={200}
                        height={200}
                        alt={userData.user.name}
                        className="w-16 h-16 rounded-full border object-cover"
                      />
                      <div className="p-1">
                        <h2 className="text-lg font-semibold">
                          {userData.user.name}
                        </h2>
                        <p className="text-gray-500">{userData.user.email}</p>
                        <span className="text-sm px-3 py-1 bg-blue-100 text-blue-600 rounded-full">
                          {userData.user.role}
                        </span>
                      </div>
                    </div>

                    {/* Company Info */}
                    <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                      <h3 className="text-md font-semibold">
                        🏢 {userData.company.name}
                      </h3>
                      <p className="text-gray-500">
                        {userData.company.industry} • {userData.company.country}
                      </p>
                    </div>

                    {/* Account Balance */}
                    <div className="mt-4 p-4 bg-green-100 rounded-lg text-green-700">
                      <h3 className="text-lg font-semibold">💰 موجودی حساب</h3>
                      <p className="text-2xl font-bold">
                        {userData.account.balance} {userData.account.currency}
                      </p>
                    </div>

                    {/* Transactions */}
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold">
                        📜 تاریخچه تراکنش‌ها
                      </h3>
                      <div className="mt-2">
                        {userData.transactions.length > 0 ? (
                          userData.transactions.map((tx) => (
                            <div
                              key={tx.id}
                              className="flex justify-between items-center p-3 border rounded-lg mb-2"
                            >
                              <div>
                                <p className="font-medium text-right py-1 mb-1">
                                  {tx.type === "deposit" ? "واریز" : "برداشت"} -{" "}
                                  {tx.amount} {tx.currency}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {tx.date}
                                </p>
                              </div>
                              <div>
                                <div
                                  className={`text-sm px-3 py-1 rounded-full text-center mb-1 ${
                                    tx.status === "completed"
                                      ? "bg-green-100 text-green-600"
                                      : "bg-yellow-100 text-yellow-600"
                                  }`}
                                >
                                  {tx.status === "completed"
                                    ? "تکمیل شده"
                                    : "در انتظار"}
                                </div>
                                <div className="text-[10px]  text-gray-500">
                                  کد پیگیری : {tx.id}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500">هیچ تراکنشی یافت نشد</p>
                        )}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Tab>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
