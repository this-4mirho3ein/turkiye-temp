import Profile from "@/components/User/Profile";
import "@/app/globals.css";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Profile> {children} </Profile>;
}
