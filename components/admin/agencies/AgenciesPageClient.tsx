"use client";

import { useState } from "react";
import { Tabs, Tab } from "@heroui/react";
import {
  FaBuilding,
  FaStar,
  FaChartBar,
  FaExclamationCircle,
  FaUsers,
} from "react-icons/fa";
import Card, { CardBody } from "@/components/admin/ui/Card";
import AgenciesList from "./AgenciesList";
import AgencyRatings from "./AgencyRatings";
import AgencyStats from "./AgencyStats";
import AgencyComplaints from "./AgencyComplaints";
import AgencyStaff from "./AgencyStaff";
import { Agency } from "../data/agencies";

interface AgenciesPageClientProps {
  initialAgencies: Agency[];
}

export default function AgenciesPageClient({
  initialAgencies,
}: AgenciesPageClientProps) {
  const [selectedTab, setSelectedTab] = useState("agencies");

  return (
    <Card>
      <CardBody className="p-0">
        <Tabs
          selectedKey={selectedTab}
          onSelectionChange={(key) => setSelectedTab(key as string)}
          color="primary"
          variant="bordered"
          classNames={{
            base: "w-full",
            tabList: "p-0 bg-gray-50 border-b border-gray-200 rounded-t-lg",
            tab: "py-3 px-6",
          }}
        >
          <Tab
            key="agencies"
            title={
              <div className="flex items-center gap-2">
                <FaBuilding />
                <span>لیست آژانس‌ها</span>
              </div>
            }
          >
            <div className="p-6">
              <AgenciesList initialAgencies={initialAgencies} />
            </div>
          </Tab>

          <Tab
            key="ratings"
            title={
              <div className="flex items-center gap-2">
                <FaStar />
                <span>امتیازات</span>
              </div>
            }
          >
            <div className="p-6">
              <AgencyRatings initialAgencies={initialAgencies} />
            </div>
          </Tab>

          <Tab
            key="stats"
            title={
              <div className="flex items-center gap-2">
                <FaChartBar />
                <span>آمار</span>
              </div>
            }
          >
            <div className="p-6">
              <AgencyStats initialAgencies={initialAgencies} />
            </div>
          </Tab>

          <Tab
            key="complaints"
            title={
              <div className="flex items-center gap-2">
                <FaExclamationCircle />
                <span>شکایات</span>
              </div>
            }
          >
            <div className="p-6">
              <AgencyComplaints initialAgencies={initialAgencies} />
            </div>
          </Tab>

          <Tab
            key="staff"
            title={
              <div className="flex items-center gap-2">
                <FaUsers />
                <span>مدیران و مشاوران</span>
              </div>
            }
          >
            <div className="p-6">
              <AgencyStaff initialAgencies={initialAgencies} />
            </div>
          </Tab>
        </Tabs>
      </CardBody>
    </Card>
  );
}
