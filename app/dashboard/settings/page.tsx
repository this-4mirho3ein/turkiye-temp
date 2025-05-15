import Setting from "@/components/User/Setting";

const initialUserData = {
  mobile: "09123456789",
  nationalCode: "1234567890",
  birthDate: "1370/01/01",
  firstName: "عباس",
  lastName: "بوعذار",
  username: "علی دایی و عباس بو عذار",
  experienceSince: "1395",
  email: "reza@example.com",
  bio: "مشاور املاک با ۸ سال سابقه در مناطق شمال شرق تهران",
  agencyName: "مشاوران املاک رضوی",
};

export default function SettingPage() {
  return <Setting />;
  // return <Setting initialUserData={initialUserData} />;
}
