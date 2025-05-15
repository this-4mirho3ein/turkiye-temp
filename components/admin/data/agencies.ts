export interface Review {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Complaint {
  id: number;
  userName: string;
  subject: string;
  description: string;
  status: "pending" | "investigating" | "resolved" | "rejected";
  date: string;
}

export interface Staff {
  id: number;
  name: string;
  role: "manager" | "consultant";
  phone: string;
  email: string;
  avatar?: string;
  joinDate: string;
  status: "active" | "inactive";
}

export interface AgencyStats {
  totalListings: number;
  activeSales: number;
  activeRentals: number;
  viewsThisMonth: number;
  inquiriesThisMonth: number;
  successfulDeals: number;
}

export interface Agency {
  id: number;
  name: string;
  logo?: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  website?: string;
  description: string;
  established: string;
  rating: number;
  reviewsCount: number;
  status: "active" | "pending" | "suspended";
  verified: boolean;
  featuredUntil?: string;
  stats: AgencyStats;
  reviews: Review[];
  complaints: Complaint[];
  staff: Staff[];
}

// Mock agencies data
const agencies: Agency[] = [
  {
    id: 1,
    name: "آژانس املاک ترکیه‌نو",
    logo: "https://randomuser.me/api/portraits/men/1.jpg",
    address: "استانبول، بشیکتاش، خیابان عباسی، پلاک ۱۲۵",
    city: "استانبول",
    phone: "02123456789",
    email: "info@turkiyenew.com",
    website: "www.turkiyenew.com",
    description: "آژانس تخصصی در زمینه خرید و فروش املاک لوکس در استانبول",
    established: "۱۳۹۵",
    rating: 4.8,
    reviewsCount: 124,
    status: "active",
    verified: true,
    featuredUntil: "۱۴۰۲/۰۶/۳۰",
    stats: {
      totalListings: 78,
      activeSales: 45,
      activeRentals: 23,
      viewsThisMonth: 2450,
      inquiriesThisMonth: 32,
      successfulDeals: 248,
    },
    reviews: [
      {
        id: 1,
        userName: "علی رضایی",
        rating: 5,
        comment: "تجربه عالی در خرید آپارتمان. مشاوره حرفه‌ای و خدمات عالی.",
        date: "۱۴۰۲/۰۲/۱۵",
      },
      {
        id: 2,
        userName: "سارا محمدی",
        rating: 4,
        comment:
          "برخورد خوب پرسنل و مشاوره دقیق. فقط کمی در پاسخگویی تاخیر داشتند.",
        date: "۱۴۰۲/۰۱/۲۳",
      },
    ],
    complaints: [
      {
        id: 1,
        userName: "محمد کریمی",
        subject: "عدم پاسخگویی تلفنی",
        description: "چندین بار تماس گرفتم اما پاسخگو نبودند.",
        status: "resolved",
        date: "۱۴۰۲/۰۱/۱۵",
      },
    ],
    staff: [
      {
        id: 1,
        name: "امیر حسینی",
        role: "manager",
        phone: "09121234567",
        email: "amir@turkiyenew.com",
        avatar: "https://randomuser.me/api/portraits/men/22.jpg",
        joinDate: "۱۳۹۵/۰۴/۱۲",
        status: "active",
      },
      {
        id: 2,
        name: "مریم علوی",
        role: "consultant",
        phone: "09129876543",
        email: "maryam@turkiyenew.com",
        avatar: "https://randomuser.me/api/portraits/women/22.jpg",
        joinDate: "۱۳۹۸/۰۷/۱۰",
        status: "active",
      },
      {
        id: 3,
        name: "رضا محمدی",
        role: "consultant",
        phone: "09123456789",
        email: "reza@turkiyenew.com",
        joinDate: "۱۴۰۰/۰۲/۱۵",
        status: "active",
      },
    ],
  },
  {
    id: 2,
    name: "املاک آنتالیا گلد",
    logo: "https://randomuser.me/api/portraits/men/2.jpg",
    address: "آنتالیا، منطقه کنیالتی، خیابان آتاتورک، شماره ۴۵",
    city: "آنتالیا",
    phone: "02423456789",
    email: "info@antalyagold.com",
    website: "www.antalyagold.com",
    description: "تخصص در فروش ویلا و آپارتمان‌های ساحلی در آنتالیا",
    established: "۱۳۹۷",
    rating: 4.6,
    reviewsCount: 89,
    status: "active",
    verified: true,
    stats: {
      totalListings: 56,
      activeSales: 38,
      activeRentals: 12,
      viewsThisMonth: 1820,
      inquiriesThisMonth: 27,
      successfulDeals: 174,
    },
    reviews: [
      {
        id: 1,
        userName: "احمد رضایی",
        rating: 5,
        comment: "ویلای فوق‌العاده‌ای با کمک این آژانس خریدم. بسیار راضی هستم.",
        date: "۱۴۰۲/۰۳/۰۵",
      },
    ],
    complaints: [
      {
        id: 1,
        userName: "سعید محمودی",
        subject: "تاخیر در انجام امور اداری",
        description: "بیش از موعد مقرر زمان برای انتقال سند طول کشید.",
        status: "pending",
        date: "۱۴۰۲/۰۳/۱۰",
      },
    ],
    staff: [
      {
        id: 1,
        name: "سعید رضوانی",
        role: "manager",
        phone: "09123456780",
        email: "saeed@antalyagold.com",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        joinDate: "۱۳۹۷/۰۲/۱۰",
        status: "active",
      },
      {
        id: 2,
        name: "نازنین کریمی",
        role: "consultant",
        phone: "09123456781",
        email: "nazanin@antalyagold.com",
        avatar: "https://randomuser.me/api/portraits/women/32.jpg",
        joinDate: "۱۳۹۹/۰۸/۱۵",
        status: "active",
      },
    ],
  },
  {
    id: 3,
    name: "آژانس املاک بسفر",
    address: "استانبول، کادیکوی، خیابان باغداد، پلاک ۳۶",
    city: "استانبول",
    phone: "02124567890",
    email: "contact@bosphorusrealty.com",
    description: "متخصص در خرید و فروش واحدهای تجاری و اداری در استانبول",
    established: "۱۳۹۹",
    rating: 4.2,
    reviewsCount: 45,
    status: "pending",
    verified: false,
    stats: {
      totalListings: 27,
      activeSales: 18,
      activeRentals: 9,
      viewsThisMonth: 980,
      inquiriesThisMonth: 15,
      successfulDeals: 65,
    },
    reviews: [
      {
        id: 1,
        userName: "مجید علیزاده",
        rating: 4,
        comment: "خرید دفتر کار با قیمت مناسب. راضی بودم.",
        date: "۱۴۰۲/۰۲/۲۰",
      },
    ],
    complaints: [],
    staff: [
      {
        id: 1,
        name: "علی مرادی",
        role: "manager",
        phone: "09123456782",
        email: "ali@bosphorusrealty.com",
        joinDate: "۱۳۹۹/۰۱/۱۵",
        status: "active",
      },
    ],
  },
  {
    id: 4,
    name: "املاک آلانیا ساحل",
    logo: "https://randomuser.me/api/portraits/men/4.jpg",
    address: "آلانیا، منطقه محمودلار، خیابان آتاتورک، پلاک ۶۷",
    city: "آلانیا",
    phone: "02425678901",
    email: "info@alanyabeach.com",
    website: "www.alanyabeach.com",
    description:
      "تخصص در فروش و اجاره ویلاهای لوکس و آپارتمان‌های ساحلی در آلانیا",
    established: "۱۳۹۸",
    rating: 4.9,
    reviewsCount: 112,
    status: "active",
    verified: true,
    featuredUntil: "۱۴۰۲/۰۸/۱۵",
    stats: {
      totalListings: 93,
      activeSales: 65,
      activeRentals: 28,
      viewsThisMonth: 3100,
      inquiriesThisMonth: 42,
      successfulDeals: 215,
    },
    reviews: [
      {
        id: 1,
        userName: "حسین ابراهیمی",
        rating: 5,
        comment: "بهترین آژانس املاک در آلانیا. خدمات عالی و قیمت منصفانه.",
        date: "۱۴۰۲/۰۳/۱۰",
      },
      {
        id: 2,
        userName: "فاطمه رضایی",
        rating: 5,
        comment: "پشتیبانی عالی، حتی بعد از خرید ملک هم همراه ما بودند.",
        date: "۱۴۰۲/۰۲/۲۵",
      },
    ],
    complaints: [],
    staff: [
      {
        id: 1,
        name: "حمید توکلی",
        role: "manager",
        phone: "09123456783",
        email: "hamid@alanyabeach.com",
        avatar: "https://randomuser.me/api/portraits/men/42.jpg",
        joinDate: "۱۳۹۸/۰۳/۲۰",
        status: "active",
      },
      {
        id: 2,
        name: "زهرا محمدی",
        role: "consultant",
        phone: "09123456784",
        email: "zahra@alanyabeach.com",
        avatar: "https://randomuser.me/api/portraits/women/42.jpg",
        joinDate: "۱۳۹۹/۰۵/۱۰",
        status: "active",
      },
      {
        id: 3,
        name: "امین رضایی",
        role: "consultant",
        phone: "09123456785",
        email: "amin@alanyabeach.com",
        joinDate: "۱۴۰۰/۰۷/۱۵",
        status: "inactive",
      },
    ],
  },
  {
    id: 5,
    name: "املاک ترابزون سبز",
    address: "ترابزون، منطقه مرکزی، خیابان جمهوریت، پلاک ۱۲",
    city: "ترابزون",
    phone: "04623456789",
    email: "info@trabzongreen.com",
    description: "متخصص در فروش املاک سرمایه‌گذاری در ترابزون",
    established: "۱۴۰۰",
    rating: 4.1,
    reviewsCount: 28,
    status: "suspended",
    verified: false,
    stats: {
      totalListings: 19,
      activeSales: 12,
      activeRentals: 5,
      viewsThisMonth: 560,
      inquiriesThisMonth: 8,
      successfulDeals: 35,
    },
    reviews: [
      {
        id: 1,
        userName: "کاظم علیزاده",
        rating: 3,
        comment: "خدمات متوسط، اما قیمت‌ها منصفانه است.",
        date: "۱۴۰۲/۰۱/۱۵",
      },
    ],
    complaints: [
      {
        id: 1,
        userName: "مهدی حسینی",
        subject: "عدم شفافیت در هزینه‌ها",
        description: "هزینه‌های جانبی در ابتدا به ما اعلام نشد.",
        status: "investigating",
        date: "۱۴۰۲/۰۲/۱۰",
      },
      {
        id: 2,
        userName: "رضا محمدی",
        subject: "عدم پاسخگویی مناسب",
        description: "بعد از پرداخت بیعانه، پاسخگویی بسیار ضعیف شد.",
        status: "pending",
        date: "۱۴۰۲/۰۲/۲۵",
      },
    ],
    staff: [
      {
        id: 1,
        name: "محسن کاظمی",
        role: "manager",
        phone: "09123456786",
        email: "mohsen@trabzongreen.com",
        joinDate: "۱۴۰۰/۰۱/۱۰",
        status: "active",
      },
    ],
  },
];

export default agencies;
