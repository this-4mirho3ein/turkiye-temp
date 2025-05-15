import React, { useState } from "react";
import {
  FiDownload,
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiCreditCard,
  FiCheck,
  FiX,
} from "react-icons/fi";

interface Transaction {
  id: string;
  amount: number;
  description: string;
  type: "income" | "expense";
  date: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  phoneNumber: string;
  hasAccess: boolean;
  creditLimit: number;
}

interface AgencyFinanceProps {
  userData?: any;
}

export default function AgencyFinance({ userData }: AgencyFinanceProps) {
  // Mock data for transactions
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      amount: 25000000,
      description: "دریافت کمیسیون معامله (کد: A12345)",
      type: "income",
      date: "1402/06/15",
    },
    {
      id: "2",
      amount: 5000000,
      description: "پرداخت حقوق به مشاور (علی محمدی)",
      type: "expense",
      date: "1402/06/10",
    },
    {
      id: "3",
      amount: 15000000,
      description: "دریافت کمیسیون معامله (کد: A12346)",
      type: "income",
      date: "1402/06/05",
    },
    {
      id: "4",
      amount: 3000000,
      description: "هزینه‌های جاری دفتر",
      type: "expense",
      date: "1402/06/01",
    },
  ]);

  // Mock data for team members
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "علی محمدی",
      role: "مدیر منطقه",
      phoneNumber: "09123456789",
      hasAccess: true,
      creditLimit: 5000000,
    },
    {
      id: "2",
      name: "سارا احمدی",
      role: "مشاور املاک",
      phoneNumber: "09123456788",
      hasAccess: false,
      creditLimit: 0,
    },
    {
      id: "3",
      name: "رضا کریمی",
      role: "مشاور املاک",
      phoneNumber: "09123456787",
      hasAccess: true,
      creditLimit: 2000000,
    },
  ]);

  // State for active tab
  const [activeTab, setActiveTab] = useState<"transactions" | "creditSharing">(
    "transactions"
  );

  // State for filter
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");

  // State for updating credit access
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [editCreditLimit, setEditCreditLimit] = useState<number>(0);

  // Filtered transactions
  const filteredTransactions = transactions.filter((transaction) => {
    if (filter === "all") return true;
    return transaction.type === filter;
  });

  // Calculate summary
  const summary = transactions.reduce(
    (acc, transaction) => {
      if (transaction.type === "income") {
        acc.totalIncome += transaction.amount;
      } else {
        acc.totalExpense += transaction.amount;
      }
      return acc;
    },
    { totalIncome: 0, totalExpense: 0 }
  );

  const balance = summary.totalIncome - summary.totalExpense;

  // Format number to display in Iranian Toman format
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("fa-IR").format(amount) + " تومان";
  };

  // Function to handle updating member credit access
  const handleUpdateCreditAccess = (memberId: string) => {
    const updatedMembers = teamMembers.map((member) => {
      if (member.id === memberId) {
        return {
          ...member,
          hasAccess: !member.hasAccess,
          creditLimit: member.hasAccess ? 0 : editCreditLimit, // Reset limit if turning off access
        };
      }
      return member;
    });

    setTeamMembers(updatedMembers);
    setEditingMemberId(null);
  };

  // Function to handle saving credit limit
  const handleSaveCreditLimit = (memberId: string) => {
    const updatedMembers = teamMembers.map((member) => {
      if (member.id === memberId) {
        return {
          ...member,
          creditLimit: editCreditLimit,
        };
      }
      return member;
    });

    setTeamMembers(updatedMembers);
    setEditingMemberId(null);
  };

  // Function to navigate to bank payment page (to be implemented)
  const handleAddCredit = () => {
    // This will be implemented later with Shaparak
    console.log("Navigate to Shaparak payment page");
    alert("انتقال به درگاه پرداخت شاپرک...");
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex justify-between items-center border-b pb-4">
        <h3 className="text-lg font-medium">امور مالی</h3>
        <div className="flex gap-2">
          <button
            onClick={handleAddCredit}
            className="px-3 py-2 bg-green-600 text-white rounded-md flex items-center gap-2 text-sm"
          >
            <FiCreditCard size={16} />
            افزایش اعتبار
          </button>
          
        </div>
      </div>


      {/* Tabs */}
      <div className="flex border-b mb-4">
        <button
          onClick={() => setActiveTab("transactions")}
          className={`px-4 py-2 ${
            activeTab === "transactions"
              ? "border-b-2 border-primary text-primary"
              : "text-gray-500"
          }`}
        >
          تراکنش‌ها
        </button>
        <button
          onClick={() => setActiveTab("creditSharing")}
          className={`px-4 py-2 ${
            activeTab === "creditSharing"
              ? "border-b-2 border-primary text-primary"
              : "text-gray-500"
          }`}
        >
          اشتراک اعتبار
        </button>
      </div>

      {activeTab === "transactions" ? (
        <>
          {/* Filters */}
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-md font-medium">تراکنش‌های اخیر</h4>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 ml-2">فیلتر:</span>
              <div className="flex space-x-2 space-x-reverse">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-3 py-1.5 text-xs rounded-md ${
                    filter === "all"
                      ? "bg-gray-200 text-gray-800"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  همه
                </button>
                <button
                  onClick={() => setFilter("income")}
                  className={`px-3 py-1.5 text-xs rounded-md ${
                    filter === "income"
                      ? "bg-green-200 text-green-800"
                      : "bg-green-50 text-green-600 hover:bg-green-100"
                  }`}
                >
                  درآمدها
                </button>
                <button
                  onClick={() => setFilter("expense")}
                  className={`px-3 py-1.5 text-xs rounded-md ${
                    filter === "expense"
                      ? "bg-red-200 text-red-800"
                      : "bg-red-50 text-red-600 hover:bg-red-100"
                  }`}
                >
                  هزینه‌ها
                </button>
              </div>
            </div>
          </div>

          {/* Transactions Desktop View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-xs font-medium text-gray-500 text-center"
                  >
                    تاریخ
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-xs font-medium text-gray-500 text-right"
                  >
                    شرح
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-xs font-medium text-gray-500 text-center"
                  >
                    نوع
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-xs font-medium text-gray-500 text-center"
                  >
                    مبلغ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-center text-sm">
                        {transaction.date}
                      </td>
                      <td className="px-4 py-3 text-right text-sm">
                        {transaction.description}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            transaction.type === "income"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {transaction.type === "income" ? "درآمد" : "هزینه"}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <span
                          className={`font-medium ${
                            transaction.type === "income"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {transaction.type === "income" ? "+" : "-"}
                          {formatAmount(transaction.amount)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      هیچ تراکنشی یافت نشد
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Transactions Mobile View */}
          <div className="md:hidden space-y-4">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="bg-white p-4 rounded-lg shadow border border-gray-100"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium">
                        {transaction.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {transaction.date}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        transaction.type === "income"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {transaction.type === "income" ? "درآمد" : "هزینه"}
                    </span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p
                      className={`text-lg font-medium ${
                        transaction.type === "income"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {formatAmount(transaction.amount)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 bg-white rounded-lg shadow-sm border border-gray-200">
                هیچ تراکنشی یافت نشد
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          {/* Credit Sharing Section */}
          <div className="mb-4">
            <div className="flex justify-between items-center">
              <h4 className="text-md font-medium">
                اشتراک اعتبار با اعضای تیم
              </h4>
              <div className="text-sm text-gray-500">
                اعتبار قابل اشتراک: {formatAmount(balance)}
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-1 mb-4">
              شما می‌توانید اعتبار خود را با اعضای تیم به اشتراک بگذارید تا آنها
              بتوانند با استفاده از آن آگهی جدید ثبت کنند.
            </p>
          </div>

          {/* Credit Sharing Desktop View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-xs font-medium text-gray-500 text-right"
                  >
                    نام و نام خانوادگی
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-xs font-medium text-gray-500 text-center"
                  >
                    نقش
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-xs font-medium text-gray-500 text-center"
                  >
                    دسترسی اعتبار
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-xs font-medium text-gray-500 text-center"
                  >
                    سقف اعتبار
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-xs font-medium text-gray-500 text-center"
                  >
                    عملیات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {teamMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-right">{member.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {member.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          member.hasAccess
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {member.hasAccess ? "دارد" : "ندارد"}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      {editingMemberId === member.id ? (
                        <input
                          type="number"
                          className="w-28 px-2 py-1 border border-gray-300 rounded-md text-sm"
                          value={editCreditLimit}
                          onChange={(e) =>
                            setEditCreditLimit(parseInt(e.target.value) || 0)
                          }
                        />
                      ) : (
                        formatAmount(member.creditLimit)
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      {editingMemberId === member.id ? (
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleSaveCreditLimit(member.id)}
                            className="p-1 text-green-600 hover:text-green-900"
                            title="ذخیره"
                          >
                            <FiCheck size={16} />
                          </button>
                          <button
                            onClick={() => setEditingMemberId(null)}
                            className="p-1 text-gray-600 hover:text-gray-900"
                            title="انصراف"
                          >
                            <FiX size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => {
                              setEditingMemberId(member.id);
                              setEditCreditLimit(member.creditLimit);
                            }}
                            className="p-1 text-blue-600 hover:text-blue-900"
                            title="ویرایش سقف اعتبار"
                          >
                            <FiDollarSign size={16} />
                          </button>
                          <button
                            onClick={() => handleUpdateCreditAccess(member.id)}
                            className={`p-1 ${
                              member.hasAccess
                                ? "text-red-600 hover:text-red-900"
                                : "text-green-600 hover:text-green-900"
                            }`}
                            title={
                              member.hasAccess
                                ? "غیرفعال‌سازی دسترسی"
                                : "فعال‌سازی دسترسی"
                            }
                          >
                            {member.hasAccess ? (
                              <FiX size={16} />
                            ) : (
                              <FiCheck size={16} />
                            )}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Credit Sharing Mobile View */}
          <div className="md:hidden space-y-4">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="bg-white p-4 rounded-lg shadow border border-gray-100"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-md font-medium">{member.name}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {member.role}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          member.hasAccess
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {member.hasAccess ? "دسترسی دارد" : "عدم دسترسی"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">سقف اعتبار:</p>
                    {editingMemberId === member.id ? (
                      <input
                        type="number"
                        className="w-28 px-2 py-1 border border-gray-300 rounded-md text-sm"
                        value={editCreditLimit}
                        onChange={(e) =>
                          setEditCreditLimit(parseInt(e.target.value) || 0)
                        }
                      />
                    ) : (
                      <p className="text-md font-medium text-gray-800">
                        {formatAmount(member.creditLimit)}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end gap-2 mt-3">
                    {editingMemberId === member.id ? (
                      <>
                        <button
                          onClick={() => handleSaveCreditLimit(member.id)}
                          className="px-3 py-1.5 bg-green-100 text-green-700 rounded-md text-xs"
                        >
                          ذخیره
                        </button>
                        <button
                          onClick={() => setEditingMemberId(null)}
                          className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-xs"
                        >
                          انصراف
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditingMemberId(member.id);
                            setEditCreditLimit(member.creditLimit);
                          }}
                          className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md text-xs"
                        >
                          تعیین سقف اعتبار
                        </button>
                        <button
                          onClick={() => handleUpdateCreditAccess(member.id)}
                          className={`px-3 py-1.5 text-xs rounded-md ${
                            member.hasAccess
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {member.hasAccess ? "لغو دسترسی" : "اعطای دسترسی"}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
