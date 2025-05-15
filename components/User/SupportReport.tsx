"use client";
import { useState, useEffect } from "react";
import {
  FaBug,
  FaPaperPlane,
  FaQuestionCircle,
  FaTicketAlt,
  FaSpinner,
  FaReply,
  FaExclamationCircle,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";
import { BiArrowBack, BiChevronDown, BiChevronUp } from "react-icons/bi";
import { useAuth } from "@/context/AuthContext";
import { submitSupportTicket, getUserTickets } from "@/controllers/makeRequest";
import { errorMessage, successMessage } from "@/utils/showMessages";

type TicketType = "bug" | "support";
type Priority = "low" | "medium" | "high" | "critical";
type TicketStatus = "pending" | "in_progress" | "resolved" | "closed";

interface Ticket {
  id: string;
  title: string;
  description: string;
  type: TicketType;
  priority: Priority;
  status: TicketStatus;
  created_at: string;
  updated_at: string;
  response?: string; // Optional response from admin
  admin_name?: string; // Optional admin name who responded
}

export default function SupportTicketPage() {
  const { state } = useAuth();
  const [ticketType, setTicketType] = useState<TicketType>("support");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium" as Priority,
    contactEmail: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);

  // Sample ticket data for preview
  const sampleTickets: Ticket[] = [
    {
      id: "ticket-1",
      title: "مشکل در آپلود تصاویر ملک",
      description: "هنگام آپلود تصاویر ملک، بعد از انتخاب چند تصویر، سیستم خطا می‌دهد و تصاویر آپلود نمی‌شوند. این مشکل در مرورگر کروم و فایرفاکس وجود دارد.",
      type: "bug",
      priority: "high",
      status: "in_progress",
      created_at: "2023-12-15T10:30:00",
      updated_at: "2023-12-15T14:45:00",
      response: "با تشکر از گزارش شما. مشکل شناسایی شد و مربوط به محدودیت نادرست در سرور است. تیم فنی در حال رفع مشکل هستند و تا فردا برطرف خواهد شد.",
      admin_name: "مدیر فنی"
    },
    {
      id: "ticket-2",
      title: "درخواست راهنمایی برای ثبت آگهی ویژه",
      description: "می‌خواهم آگهی خود را به صورت ویژه ثبت کنم اما نمی‌دانم چگونه باید هزینه آن را پرداخت کنم و چه مزایایی دارد. لطفاً راهنمایی کنید.",
      type: "support",
      priority: "medium",
      status: "resolved",
      created_at: "2023-12-10T09:15:00",
      updated_at: "2023-12-11T16:30:00",
      response: "با سلام، برای ثبت آگهی ویژه می‌توانید از بخش \"ارتقاء آگهی\" در پنل کاربری خود استفاده کنید. مزایای آگهی ویژه شامل نمایش در صفحه اول، نشان ویژه و اولویت در نتایج جستجو است. هزینه آن 50,000 تومان برای 30 روز است. شما می‌توانید از طریق کیف پول نیز پرداخت انجام دهید. کافیست در صفحه پرداخت، گزینه \"پرداخت از کیف پول\" را انتخاب کنید.",
      admin_name: "کارشناس فروش"
    },
    {
      id: "ticket-3",
      title: "مشکل در ثبت‌نام با شماره موبایل",
      description: "هنگام ثبت‌نام، کد تایید به شماره موبایل من ارسال نمی‌شود. چندین بار تلاش کردم اما موفق نشدم.",
      type: "bug",
      priority: "critical",
      status: "pending",
      created_at: "2023-12-18T16:20:00",
      updated_at: "2023-12-18T16:20:00"
    },
    {
      id: "ticket-4",
      title: "درخواست حذف آگهی",
      description: "می‌خواهم آگهی با کد 12345 را حذف کنم زیرا ملک فروخته شده است.",
      type: "support",
      priority: "low",
      status: "closed",
      created_at: "2023-11-25T08:30:00",
      updated_at: "2023-11-26T09:45:00",
      response: "آگهی شما با موفقیت حذف شد. با تشکر از اطلاع‌رسانی شما.",
      admin_name: "پشتیبان"
    },
    {
      id: "ticket-5",
      title: "پیشنهاد بهبود سیستم جستجو",
      description: "پیشنهاد می‌کنم امکان جستجو بر اساس فاصله از مترو یا ایستگاه اتوبوس اضافه شود. این ویژگی برای افرادی که از حمل و نقل عمومی استفاده می‌کنند بسیار مفید خواهد بود.",
      type: "support",
      priority: "medium",
      status: "in_progress",
      created_at: "2023-12-05T14:10:00",
      updated_at: "2023-12-07T11:25:00",
      response: "با سلام و تشکر از پیشنهاد ارزشمند شما. این موضوع را به تیم توسعه منتقل کردیم و در برنامه‌های آینده سایت در نظر گرفته خواهد شد.",
      admin_name: "مدیر محصول"
    }
  ];

  useEffect(() => {
    // For preview purposes, use sample data instead of fetching from server
    // Comment this line and uncomment fetchUserTickets() when connecting to real API
    setTickets(sampleTickets);
    
    // Fetch user tickets when component mounts
    // fetchUserTickets();
  }, []);

  const fetchUserTickets = async () => {
    if (!state.accessToken) return;
    
    setIsLoading(true);
    try {
      const response = await getUserTickets(state.accessToken);
      if (response.status === 200) {
        setTickets(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
    setIsSubmitting(true);

    try {
      const response = await submitSupportTicket(state.accessToken, {
        ...formData,
        type: ticketType,
      });

      if (response.status === 200 || response.status === 201) {
        setSubmitSuccess(true);
        setFormData({
          title: "",
          description: "",
          priority: "medium",
          contactEmail: "",
        });
        successMessage(
          ticketType === "bug"
            ? "گزارش با موفقیت ارسال شد"
            : "درخواست با موفقیت ثبت شد"
        );
        // Refresh tickets after submission
        fetchUserTickets();
      } else {
        throw new Error(response.data?.message || "خطا در ارسال درخواست");
      }
    } catch (error: any) {
      console.error("Error submitting ticket:", error);
      errorMessage(error.message || "خطا در ارسال درخواست");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTicket = (ticketId: string) => {
    if (expandedTicket === ticketId) {
      setExpandedTicket(null);
    } else {
      setExpandedTicket(ticketId);
    }
  };

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: TicketStatus) => {
    switch (status) {
      case "pending":
        return <FaClock className="mr-1" />;
      case "in_progress":
        return <FaSpinner className="mr-1" />;
      case "resolved":
        return <FaCheckCircle className="mr-1" />;
      case "closed":
        return <FaExclamationCircle className="mr-1" />;
      default:
        return <FaClock className="mr-1" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const renderPreviousTickets = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-8">
          <FaSpinner className="animate-spin text-primary text-2xl" />
          <span className="mr-2">در حال بارگذاری تیکت‌ها...</span>
        </div>
      );
    }

    if (tickets.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <FaTicketAlt className="mx-auto text-3xl mb-2 text-gray-400" />
          <p>شما هنوز تیکتی ثبت نکرده‌اید</p>
        </div>
      );
    }

    return (
      <div className="space-y-4 p-4">
        <h2 className="text-xl font-bold mb-4 border-b pb-2">تیکت‌های قبلی شما</h2>
        
        {tickets.map((ticket) => (
          <div 
            key={ticket.id} 
            className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Ticket Header */}
            <div 
              className="flex justify-between items-center p-4 cursor-pointer bg-gray-50"
              onClick={() => toggleTicket(ticket.id)}
            >
              <div className="flex items-center">
                <div className={`p-2 rounded-full ${ticket.type === 'bug' ? 'bg-red-100' : 'bg-blue-100'} ml-3`}>
                  {ticket.type === 'bug' ? (
                    <FaBug className="text-red-600" />
                  ) : (
                    <FaTicketAlt className="text-blue-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{ticket.title}</h3>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <span className="ml-2">{formatDate(ticket.created_at)}</span>
                    <span className={`px-2 py-1 rounded-full text-xs flex items-center ${getStatusColor(ticket.status)}`}>
                      {getStatusIcon(ticket.status)}
                      {ticket.status === 'pending' && 'در انتظار بررسی'}
                      {ticket.status === 'in_progress' && 'در حال بررسی'}
                      {ticket.status === 'resolved' && 'حل شده'}
                      {ticket.status === 'closed' && 'بسته شده'}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                {expandedTicket === ticket.id ? (
                  <BiChevronUp className="text-xl" />
                ) : (
                  <BiChevronDown className="text-xl" />
                )}
              </div>
            </div>
            
            {/* Ticket Content */}
            {expandedTicket === ticket.id && (
              <div className="p-4 border-t">
                <div className="bg-gray-50 p-3 rounded-lg mb-4">
                  <p className="text-sm whitespace-pre-wrap">{ticket.description}</p>
                </div>
                
                {/* Admin Response */}
                {ticket.response ? (
                  <div className="space-y-3 mt-4">
                    <h4 className="font-medium text-sm border-b pb-2">پاسخ:</h4>
                    <div className="p-3 rounded-lg bg-blue-50 mr-4">
                      <div className="flex items-center mb-2">
                        <div className="p-1 rounded-full bg-blue-100 ml-2">
                          <FaReply className="text-blue-600 text-xs" />
                        </div>
                        <span className="text-xs font-medium">
                          {ticket.admin_name || 'پشتیبان'}
                        </span>
                        <span className="text-xs text-gray-500 mr-2">
                          {formatDate(ticket.updated_at)}
                        </span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{ticket.response}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-3 text-gray-500 text-sm">
                    <p>هنوز پاسخی برای این تیکت ثبت نشده است</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    );
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
            onClick={() => setSubmitSuccess(false)}
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
    <div className="col-span-12 lg:col-span-9">
      <div className="">
        <div className="max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            {renderPreviousTickets()}
            
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
              </button>{" "}
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
        </div>
      </div>
    </div>
  );
}
