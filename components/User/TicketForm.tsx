import React, { useState } from "react";
import {
  FaBug,
  FaPaperPlane,
  FaQuestionCircle,
  FaTicketAlt,
  FaSpinner,
} from "react-icons/fa";
import { BiArrowBack } from "react-icons/bi";
import { TicketType, Priority } from "./SupportTicketPage";

interface TicketFormProps {
  onSubmit: (formData: {
    title: string;
    description: string;
    priority: Priority;
    contactEmail: string;
    type: TicketType;
  }) => Promise<void>;
  isSubmitting: boolean;
  submitSuccess: boolean;
  onResetSuccess: () => void;
}

const TicketForm: React.FC<TicketFormProps> = ({
  onSubmit,
  isSubmitting,
  submitSuccess,
  onResetSuccess,
}) => {
  const [ticketType, setTicketType] = useState<TicketType>("support");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium" as Priority,
    contactEmail: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      ...formData,
      type: ticketType,
    });
  };

  if (submitSuccess) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="text-center py-8">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <FaPaperPlane className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {ticketType === "bug"
              ? "گزارش شما ارسال شد!"
              : "تیکت پشتیبانی شما ثبت شد!"}
          </h2>
          <p className="text-gray-600 mb-6">
            {ticketType === "bug"
              ? "با تشکر از شما برای کمک به بهبود سیستم. ما گزارش شما را بررسی خواهیم کرد."
              : "با تشکر از تماس شما. تیم پشتیبانی در اسرع وقت با شما تماس خواهد گرفت."}
          </p>
          <button
            onClick={onResetSuccess}
            className="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-md transition-colors flex items-center mx-auto"
          >
            <BiArrowBack className="ml-2" />
            {ticketType === "bug" ? "ارسال گزارش جدید" : "ارسال تیکت جدید"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      {/* Type Selector */}
      <div className="flex border-b">
        <button
          type="button"
          onClick={() => setTicketType("support")}
          className={`flex-1 py-4 px-6 text-center font-medium flex items-center justify-center gap-2 ${
            ticketType === "support"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <FaQuestionCircle />
          درخواست پشتیبانی
        </button>
        <button
          type="button"
          onClick={() => setTicketType("bug")}
          className={`flex-1 py-4 px-6 text-center font-medium flex items-center justify-center gap-2 ${
            ticketType === "bug"
              ? "border-b-2 border-red-500 text-red-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <FaBug className="" />
          گزارش خطا
        </button>
      </div>

      {/* Hero Header */}
      <div
        className={`p-6 md:p-8 flex items-center ${
          ticketType === "bug"
            ? "bg-gradient-to-r from-red-50 to-orange-50"
            : "bg-gradient-to-r from-blue-50 to-cyan-50"
        }`}
      >
        <div
          className={`p-3 rounded-full mr-4 ${
            ticketType === "bug" ? "bg-red-100" : "bg-blue-100"
          }`}
        >
          {ticketType === "bug" ? (
            <FaBug className="text-red-600 text-2xl" />
          ) : (
            <FaTicketAlt className="text-blue-600 text-2xl" />
          )}
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mx-2">
            {ticketType === "bug" ? "گزارش خطا" : "درخواست پشتیبانی"}
          </h1>
          <p className="text-gray-600 mt-1 mx-2">
            {ticketType === "bug"
              ? "اگر با مشکل یا خطایی مواجه شده‌اید، لطفاً از طریق فرم زیر آن را با ما در میان بگذارید."
              : "برای دریافت کمک از تیم پشتیبانی، لطفاً درخواست خود را به طور کامل شرح دهید."}
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="p-6 md:p-8">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Title Field */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {ticketType === "bug" ? "عنوان مشکل" : "عنوان درخواست"}
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition"
                placeholder={
                  ticketType === "bug"
                    ? "مثلاً: مشکل در آپلود تصویر"
                    : "مثلاً: راهنمایی در مورد ویژگی جدید"
                }
              />
            </div>

            {/* Description Field */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {ticketType === "bug"
                  ? "شرح کامل مشکل"
                  : "شرح کامل درخواست"}
              </label>
              <textarea
                id="description"
                name="description"
                rows={5}
                value={formData.description}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition"
                placeholder={
                  ticketType === "bug"
                    ? "لطفاً مشکل را با جزئیات کامل شرح دهید..."
                    : "لطفاً درخواست خود را با جزئیات کامل شرح دهید..."
                }
              ></textarea>
            </div>

            {/* Priority Field */}
            <div>
              <label
                htmlFor="priority"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                سطح اهمیت
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-primary focus:border-primary transition appearance-auto"
              >
                <option value="low">کم اهمیت</option>
                <option value="medium">متوسط</option>
                <option value="high">مهم</option>
                <option value="critical">بحرانی</option>
              </select>
            </div>

            {/* Contact Email Field */}
            <div>
              <label
                htmlFor="contactEmail"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                ایمیل برای پیگیری (اختیاری)
              </label>
              <input
                type="email"
                id="contactEmail"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition"
                placeholder="example@domain.com"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  ticketType === "bug"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-blue-600 hover:bg-blue-700"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  ticketType === "bug"
                    ? "focus:ring-red-500"
                    : "focus:ring-blue-500"
                } transition ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin ml-2 h-4 w-4 text-white" />
                    در حال ارسال...
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="ml-2" />
                    {ticketType === "bug"
                      ? "ارسال گزارش"
                      : "ارسال درخواست"}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Tips Section */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          {ticketType === "bug"
            ? "راهنمایی برای گزارش بهتر:"
            : "راهنمایی برای درخواست بهتر:"}
        </h3>
        <ul className="text-sm text-gray-600 space-y-1 list-disc pr-5">
          {ticketType === "bug" ? (
            <>
              <li>مراحل دقیق ایجاد مشکل را شرح دهید</li>
              <li>در صورت امکان، تصاویر یا فیلم از مشکل ضمیمه کنید</li>
              <li>
                پیام‌های خطا را دقیقاً همانطور که نمایش داده شده‌اند وارد
                کنید
              </li>
              <li>سیستم عامل و مرورگر خود را ذکر کنید</li>
            </>
          ) : (
            <>
              <li>درخواست خود را به طور کامل و واضح شرح دهید</li>
              <li>در صورت نیاز، تصاویر یا اسناد مربوطه را ضمیمه کنید</li>
              <li>محدوده زمانی مورد نیاز خود را مشخص کنید</li>
              <li>اطلاعات تماس خود را به درستی وارد نمایید</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default TicketForm;