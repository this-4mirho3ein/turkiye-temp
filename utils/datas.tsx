import { JSX } from "react";
import {
  FaBriefcase,
  FaUmbrellaBeach,
  FaIndustry,
  FaCog,
  FaTractor,
  FaChild,
  FaVideo,
  FaMap,
  FaLeaf,
} from "react-icons/fa";
import { IoBed, IoLocation, IoResize, IoSparkles } from "react-icons/io5";
import {
  FaRulerCombined,
  FaBed,
  FaBuilding,
  FaCalendarAlt,
  FaLayerGroup,
  FaFileAlt,
  FaWrench,
  FaWarehouse,
  FaTree,
  FaTint,
  FaGasPump,
  FaSolarPanel,
  FaShieldAlt,
  FaSwimmer,
  FaRoad,
  FaFireExtinguisher,
  FaTruckMoving,
  FaUtensils,
  FaWalking,
  FaHome,
} from "react-icons/fa";
import {
  MdOutlineMeetingRoom,
  MdBalcony,
  MdOutlineLocalParking,
  MdOutlineElevator,
  MdOutlineStorage,
  MdOutlineSecurity,
  MdOutlineAir,
  MdOutlineFireTruck,
  MdOutlineGrass,
} from "react-icons/md";
import {
  GiFarmTractor,
  GiElectric,
  GiWaterTower,
  GiDrippingTube,
  GiPoolTableCorner,
} from "react-icons/gi";

const iconClass = "text-[#a3abb0] inline mb-1";

export const filterIcons = {
  size: <FaRulerCombined className={iconClass} />, // متراژ
  rooms: <FaBed className={iconClass} />, // تعداد اتاق
  yearBuilt: <FaCalendarAlt className={iconClass} />, // سال ساخت
  floor: <FaLayerGroup className={iconClass} />, // طبقه
  totalFloors: <FaBuilding className={iconClass} />, // تعداد کل طبقات
  deedType: <FaFileAlt className={iconClass} />, // نوع سند
  propertyCondition: <FaWrench className={iconClass} />, // وضعیت ملک
  businessType: <FaWarehouse className={iconClass} />, // نوع کاربری تجاری
  streetFrontage: <FaRoad className={iconClass} />, // بر خیابان
  landArea: <FaMap className={iconClass} />, // مساحت زمین
  landUsage: <GiFarmTractor className={iconClass} />, // نوع کاربری مزروعی
  soilType: <FaLeaf className={iconClass} />, // نوع خاک
  waterAccess: <FaTint className={iconClass} />, // دسترسی به آب
  electricity: <GiElectric className={iconClass} />, // برق
  gas: <FaGasPump className={iconClass} />, // گاز
  waterReservoir: <GiWaterTower className={iconClass} />, // مخزن آب
  waterWell: <FaTint className={iconClass} />, // چاه آب
  dripIrrigation: <GiDrippingTube className={iconClass} />, // سیستم آبیاری قطره‌ای
  guardhouse: <FaShieldAlt className={iconClass} />, // ساختمان نگهبانی
  solarPower: <FaSolarPanel className={iconClass} />, // سیستم انرژی خورشیدی
  usageType: <FaHome className={iconClass} />, // نوع کاربری رفاهی
  pool: <FaSwimmer className={iconClass} />, // استخر
  saunaJacuzzi: <GiPoolTableCorner className={iconClass} />, // سونا / جکوزی
  guestParking: <MdOutlineLocalParking className={iconClass} />, // پارکینگ مهمان
  greenSpace: <MdOutlineGrass className={iconClass} />, // فضای سبز
  kidsPlayArea: <FaChild className={iconClass} />, // فضای بازی کودکان
  walkingPath: <FaWalking className={iconClass} />, // مسیر پیاده‌روی
  restaurantCafe: <FaUtensils className={iconClass} />, // رستوران / کافه
  eventHall: <FaBuilding className={iconClass} />, // سالن اجتماعات
  hallArea: <FaWarehouse className={iconClass} />, // مساحت سالن صنعتی
  ceilingHeight: <FaBuilding className={iconClass} />, // ارتفاع سقف
  industrialElectricity: <GiElectric className={iconClass} />, // برق صنعتی
  industrialGas: <FaGasPump className={iconClass} />, // گاز صنعتی
  cityWater: <FaTint className={iconClass} />, // آب شهری
  cctv: <FaVideo className={iconClass} />, // دوربین مدار بسته
  loadingDock: <FaTruckMoving className={iconClass} />, // سکوی بارگیری
  cargoElevator: <MdOutlineElevator className={iconClass} />, // آسانسور باربری
  fireproofCeiling: <FaFireExtinguisher className={iconClass} />, // سقف ضدحریق
  heavyLoadFlooring: <FaWarehouse className={iconClass} />, // کف مقاوم برای تجهیزات سنگین
  separateOffice: <MdOutlineMeetingRoom className={iconClass} />, // دفتر اداری مستقل
  parking: <MdOutlineLocalParking className={iconClass} />, // پارکینگ
  storage: <MdOutlineStorage className={iconClass} />, // انباری
  elevator: <MdOutlineElevator className={iconClass} />, // آسانسور
  balcony: <MdBalcony className={iconClass} />, // بالکن
  heatingSystem: <MdOutlineAir className={iconClass} />, // سیستم گرمایشی
  coolingSystem: <MdOutlineAir className={iconClass} />, // سیستم سرمایشی
  securityDoor: <MdOutlineSecurity className={iconClass} />, // درب ضد سرقت
  fireTruckAccess: <MdOutlineFireTruck className={iconClass} />, // دسترسی آتش‌نشانی
};

export const properties = [
  {
    title: "مسکونی",
    slug: "housing",
    icon: <FaHome className="ml-2 inline" />,
  },
  {
    title: "تجاری",
    slug: "commercial",
    icon: <FaBriefcase className="ml-2 inline" />,
  },
  {
    title: "مزروعی",
    slug: "plot",
    icon: <FaTree className="ml-2 inline" />,
  },
  {
    title: "رفاهی",
    slug: "welfare",
    icon: <FaUmbrellaBeach className="ml-2 inline" />,
  },
  {
    title: "صنعتی",
    slug: "industrial",
    icon: <FaIndustry className="ml-2 inline" />,
  },
  {
    title: "سایر",
    slug: "others",
    icon: <FaCog className="ml-2 inline" />,
  },
];

export const propertyFeatures: Record<
  string,
  { icon: JSX.Element; label: string; key: any }[]
> = {
  housing: [
    {
      icon: <IoBed className="text-[#a3abb0]" />,
      label: "اتاق",
      key: "rooms",
    },
    {
      icon: <IoResize className="text-[#a3abb0]" />,
      label: "متراژ",
      key: "size",
    },
  ],
  commercial: [
    {
      icon: <IoResize className="text-[#a3abb0]" />,
      label: "متراژ",
      key: "size",
    },
    {
      icon: <FaBriefcase className="text-[#a3abb0]" />,
      label: "کاربری",
      key: "usage_type",
    },
  ],
  plot: [
    {
      icon: <IoResize className="text-[#a3abb0]" />,
      label: "مساحت",
      key: "land_area",
    },
    {
      icon: <FaTractor className="text-[#a3abb0]" />,
      label: "نوع کاربری",
      key: "usage_type",
    },
  ],
  welfare: [
    {
      icon: <IoResize className="text-[#a3abb0]" />,
      label: "متراژ",
      key: "size",
    },
    {
      icon: <IoLocation className="text-[#a3abb0]" />,
      label: "دسترسی",
      key: "accessibility",
    },
  ],
  industrial: [
    {
      icon: <IoResize className="text-[#a3abb0]" />,
      label: "متراژ",
      key: "size",
    },
    {
      icon: <IoLocation className="text-[#a3abb0]" />,
      label: "کاربری",
      key: "usage_type",
    },
  ],
  others: [
    {
      icon: <IoResize className="text-[#a3abb0]" />,
      label: "متراژ",
      key: "size",
    },
    {
      icon: <IoSparkles className="text-[#a3abb0]" />,
      label: "ویژگی خاص",
      key: "special_features",
    }, // مقدار تک‌کلمه‌ای (مثلاً: "چشم‌انداز")
  ],
};
