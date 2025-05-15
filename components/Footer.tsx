import Link from "next/link";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaTelegram,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-white text-light ">
      <div className="container mx-auto px-4 pt-5 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Us */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold border-b-2 border-primary pb-2">
              درباره ما
            </h3>
            <p className="text-dark text-justify">
              وبسایت با سال‌ها تجربه در زمینه خرید و فروش و اجاره ملک، آماده
              ارائه بهترین خدمات به شما مشتریان گرامی می‌باشد.
            </p>
            <div className="flex space-x-4 space-x-reverse">
              <a
                href="#"
                className="text-light hover:scale-110 hover:text-cyan-600 transition p-2"
              >
                <FaTelegram size={22} />
              </a>
              <a
                href="#"
                className="text-light hover:scale-110 hover:text-fuchsia-600 transition p-2"
              >
                <FaInstagram size={22} />
              </a>
              <a
                href="#"
                className="text-light hover:scale-110 hover:text-sky-700 transition p-2"
              >
                <FaLinkedin size={22} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold border-b-2 border-primary pb-2">
              لینک‌های سریع
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-dark hover:text-white transition"
                >
                  صفحه اصلی
                </Link>
              </li>
              <li>
                <Link
                  href="/properties"
                  className="text-dark hover:text-white transition"
                >
                  لیست املاک
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-dark hover:text-white transition"
                >
                  درباره ما
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-dark hover:text-white transition"
                >
                  تماس با ما
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/register-realestate"
                  className="text-dark hover:text-white transition"
                >
                  ثبت آژانس املاک
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold border-b-2 border-primary pb-2">
              اطلاعات تماس
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2 space-x-reverse">
                <FaPhone className="mt-1 text-primary" />
                <a
                  href={`tel:${"989355006488".replace(/-/g, "")}`}
                  className="text-dark hover:text-primary transition-colors duration-200"
                >
                  {"9355006488"}
                </a>
              </li>
              <li className="flex items-start space-x-2 space-x-reverse">
                <FaEnvelope className="mt-1 text-primary" />
                <span className="text-dark">info@example.com</span>
              </li>
              <li className="flex items-start space-x-2 space-x-reverse">
                <FaMapMarkerAlt className="mt-1 text-primary" />
                <span className="text-dark">تهران، خیابان نمونه، پلاک ۱۲۳</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold border-b-2 border-primary pb-2">
              خبرنامه
            </h3>
            <p className="text-dark">
              برای دریافت جدیدترین آگهی‌ها در ایمیل خود، عضو خبرنامه ما شوید.
            </p>
            <form className="flex flex-col space-y-3">
              <input
                type="email"
                placeholder="آدرس ایمیل"
                className="px-4 py-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <button
                type="submit"
                className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded transition"
              >
                عضویت
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-light">
          <p>
            © {new Date().getFullYear()} تمامی حقوق برای وبسایت املاک محفوظ است.
          </p>
        </div>
      </div>
    </footer>
  );
}
