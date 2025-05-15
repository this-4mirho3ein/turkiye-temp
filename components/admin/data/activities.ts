export type ActivityStatus = "success" | "warning" | "danger" | "info";

export interface Activity {
  id: number;
  title: string;
  time: string;
  status: ActivityStatus;
  user: {
    name: string;
    avatar?: string;
  };
}

const recentActivities: Activity[] = [
  {
    id: 1,
    title: "آگهی جدید ثبت کرد",
    time: "۱۰ دقیقه پیش",
    status: "success",
    user: {
      name: "امیرحسین محمدی",
      avatar: "https://via.placeholder.com/40",
    },
  },
  {
    id: 2,
    title: "درخواست ویرایش آگهی",
    time: "۱ ساعت پیش",
    status: "warning",
    user: {
      name: "سارا احمدی",
      avatar: "https://via.placeholder.com/40",
    },
  },
  {
    id: 3,
    title: "درخواست حذف آگهی",
    time: "۲ ساعت پیش",
    status: "danger",
    user: {
      name: "محمد رضایی",
    },
  },
  {
    id: 4,
    title: "کاربر جدید ثبت نام کرد",
    time: "۳ ساعت پیش",
    status: "info",
    user: {
      name: "نازنین کریمی",
      avatar: "https://via.placeholder.com/40",
    },
  },
  {
    id: 5,
    title: "آگهی تأیید شد",
    time: "۵ ساعت پیش",
    status: "success",
    user: {
      name: "علی حسینی",
      avatar: "https://via.placeholder.com/40",
    },
  },
];

export default recentActivities;
