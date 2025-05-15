"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { submitSupportTicket, getUserTickets } from "@/controllers/makeRequest";
import { errorMessage, successMessage } from "@/utils/showMessages";
import TicketList from "./TicketList";
import TicketForm from "./TicketForm";

export type TicketType = "bug" | "support";
export type Priority = "low" | "medium" | "high" | "critical";
export type TicketStatus = "pending" | "in_progress" | "resolved" | "closed";

export interface Ticket {
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSubmitTicket = async (formData: {
    title: string;
    description: string;
    priority: Priority;
    contactEmail: string;
    type: TicketType;
  }) => {
    setIsSubmitting(true);

    try {
      const response = await submitSupportTicket(state.accessToken, formData);

      if (response.status === 200 || response.status === 201) {
        setSubmitSuccess(true);
        successMessage(
          formData.type === "bug"
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

  const handleResetSuccess = () => {
    setSubmitSuccess(false);
  };

  return (
    <div className="col-span-12 lg:col-span-9">
      <div className="">
        <div className="max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-6">
            <TicketList tickets={tickets} isLoading={isLoading} />
          </div>
          
          <TicketForm 
            onSubmit={handleSubmitTicket}
            isSubmitting={isSubmitting}
            submitSuccess={submitSuccess}
            onResetSuccess={handleResetSuccess}
          />
        </div>
      </div>
    </div>
  );
}