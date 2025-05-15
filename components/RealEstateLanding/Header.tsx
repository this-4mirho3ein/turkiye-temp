import Image from "next/image";
import { HeaderData } from "./Main";

interface HeaderProps {
  headerData: HeaderData;
}

export default function Header({ headerData }: HeaderProps) {
  return (
    <>
      <div className="relative h-64 md:h-96 w-full">
        <Image
          src={headerData.profileImage}
          width={1920}
          height={1080}
          alt={headerData.alt || "Company Background"}
          className="w-full h-full object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-gray-900/30"></div>
      </div>
      <div className="relative px-6 md:px-12 py-8">
        <div className="absolute -top-20 right-6 md:right-12 w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white bg-white shadow-xl overflow-hidden">
          <Image
            src={headerData.logo || headerData.profileImage}
            width={400}
            height={400}
            alt={headerData.logoalt || "Profile"}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="mr-40 md:mr-48 mt-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
            {headerData.companyName}
          </h1>
          <p className="text-gray-600 mb-4">{headerData.location}</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
              <div className="flex items-center text-yellow-400 ml-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 fill-current ${
                      i < Math.round(headerData.rating) ? "text-yellow-400" : "text-gray-300"
                    }`}
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <span className="font-bold text-blue-700 text-sm">{headerData.rating}</span>
              <span className="text-gray-500 text-xs mr-1">({headerData.reviews} نظر)</span>
            </div>
            <div className="flex items-center text-gray-600 text-sm">
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>{headerData.location}</span>
            </div>
            <div className="flex items-center text-gray-600 text-sm">
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>تاسیس {headerData.establishedYear}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="px-6 md:px-12 pb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatItem value={headerData.stats.experience} label="سال تجربه" />
        <StatItem value={headerData.stats.activeProperties} label="املاک فعال" />
        <StatItem value={headerData.stats.satisfiedClients} label="مشتریان راضی" />
        <StatItem value={headerData.stats.cities} label="شهرها" />
      </div>
      <div className="border-t border-gray-100"></div>
    </>
  );
}

const StatItem = ({ value, label }: { value: string; label: string }) => (
  <div className="bg-gray-50 p-4 rounded-xl text-center">
    <p className="text-2xl font-bold text-blue-600">{value}</p>
    <p className="text-gray-600 mt-1">{label}</p>
  </div>
);