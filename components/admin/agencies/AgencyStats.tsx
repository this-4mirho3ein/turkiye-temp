"use client";

import { useState } from "react";
import {
  Card,
  CardBody,
  Select,
  SelectItem,
  Spinner,
  RadioGroup,
  Radio,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from "@heroui/react";
import {
  FaBuilding,
  FaListAlt,
  FaHandshake,
  FaEye,
  FaEnvelope,
  FaChartLine,
  FaSyncAlt,
  FaExclamationCircle,
  FaFilter,
  FaCalendarAlt,
} from "react-icons/fa";
import { Agency } from "../data/agencies";

interface AgencyStatsProps {
  initialAgencies: Agency[];
}

export default function AgencyStats({ initialAgencies }: AgencyStatsProps) {
  const [selectedAgencyId, setSelectedAgencyId] = useState<number | "all">(
    "all"
  );
  const [dataType, setDataType] = useState<"listings" | "deals" | "views">(
    "listings"
  );
  const [periodFilter, setPeriodFilter] = useState<"month" | "year">("month");
  const [isLoading, setIsLoading] = useState(false);

  // Get all agencies or selected agency
  const getAgenciesToShow = () => {
    if (selectedAgencyId === "all") {
      return initialAgencies;
    }

    const selectedAgency = initialAgencies.find(
      (agency) => agency.id === selectedAgencyId
    );

    return selectedAgency ? [selectedAgency] : [];
  };

  const agenciesToShow = getAgenciesToShow();

  // Prepare data for summary cards
  const summaryData = {
    totalListings: agenciesToShow.reduce(
      (sum, agency) => sum + agency.stats.totalListings,
      0
    ),
    activeSales: agenciesToShow.reduce(
      (sum, agency) => sum + agency.stats.activeSales,
      0
    ),
    activeRentals: agenciesToShow.reduce(
      (sum, agency) => sum + agency.stats.activeRentals,
      0
    ),
    viewsThisMonth: agenciesToShow.reduce(
      (sum, agency) => sum + agency.stats.viewsThisMonth,
      0
    ),
    inquiriesThisMonth: agenciesToShow.reduce(
      (sum, agency) => sum + agency.stats.inquiriesThisMonth,
      0
    ),
    successfulDeals: agenciesToShow.reduce(
      (sum, agency) => sum + agency.stats.successfulDeals,
      0
    ),
  };

  // Generate mock monthly data
  const getMonthlyData = () => {
    const months = [
      "فروردین",
      "اردیبهشت",
      "خرداد",
      "تیر",
      "مرداد",
      "شهریور",
      "مهر",
      "آبان",
      "آذر",
      "دی",
      "بهمن",
      "اسفند",
    ];

    let dataPoints;

    switch (dataType) {
      case "listings":
        dataPoints = [65, 72, 78, 85, 90, 82, 75, 80, 92, 97, 105, 110];
        break;
      case "deals":
        dataPoints = [12, 15, 18, 22, 20, 17, 19, 23, 25, 28, 30, 32];
        break;
      case "views":
        dataPoints = [
          1200, 1500, 1800, 2100, 2350, 2100, 1900, 2200, 2500, 2700, 2900,
          3100,
        ];
        break;
      default:
        dataPoints = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }

    return months.map((month, index) => ({
      month,
      value: dataPoints[index],
    }));
  };

  const monthlyData = getMonthlyData();

  // Handle refresh data
  const handleRefresh = () => {
    setIsLoading(true);

    // Simulate data loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Filters Card */}
      <Card>
        <CardBody>
          <div className="flex items-center mb-4">
            <FaFilter className="text-blue-600 ml-2" />
            <h3 className="text-lg font-medium">فیلترها</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4">
              <Select
                label="آژانس"
                selectedKeys={[selectedAgencyId.toString()]}
                onChange={(e) =>
                  setSelectedAgencyId(
                    e.target.value === "all" ? "all" : parseInt(e.target.value)
                  )
                }
                startContent={<FaBuilding className="text-gray-400" />}
                fullWidth
              >
                <SelectItem key="all">همه آژانس‌ها</SelectItem>
                {initialAgencies.map((agency) => (
                  <SelectItem key={agency.id.toString()}>
                    {agency.name}
                  </SelectItem>
                ))}
              </Select>
            </div>

            <div className="lg:col-span-4">
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="mb-2 flex items-center">
                  <FaChartLine className="text-gray-500 ml-2" />
                  <span className="text-sm font-medium text-gray-700">
                    نوع داده
                  </span>
                </div>
                <RadioGroup
                  orientation="horizontal"
                  value={dataType}
                  onValueChange={(value) =>
                    setDataType(value as "listings" | "deals" | "views")
                  }
                >
                  <Radio value="listings">ملک‌ها</Radio>
                  <Radio value="deals">معاملات</Radio>
                  <Radio value="views">بازدیدها</Radio>
                </RadioGroup>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="mb-2 flex items-center">
                  <FaCalendarAlt className="text-gray-500 ml-2" />
                  <span className="text-sm font-medium text-gray-700">
                    بازه زمانی
                  </span>
                </div>
                <RadioGroup
                  orientation="horizontal"
                  value={periodFilter}
                  onValueChange={(value) =>
                    setPeriodFilter(value as "month" | "year")
                  }
                >
                  <Radio value="month">ماهانه</Radio>
                  <Radio value="year">سالانه</Radio>
                </RadioGroup>
              </div>
            </div>

            <div className="lg:col-span-1 flex items-center justify-center">
              <Button
                isIconOnly
                color="primary"
                onClick={handleRefresh}
                isLoading={isLoading}
                aria-label="بروزرسانی"
                className="h-10 w-10"
              >
                <FaSyncAlt />
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardBody className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <FaListAlt className="text-blue-600 text-xl" />
            </div>
            <div className="mr-4">
              <p className="text-sm text-gray-500">کل ملک‌ها</p>
              <p className="text-xl font-bold">{summaryData.totalListings}</p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <FaHandshake className="text-green-600 text-xl" />
            </div>
            <div className="mr-4">
              <p className="text-sm text-gray-500">معاملات موفق</p>
              <p className="text-xl font-bold">{summaryData.successfulDeals}</p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <FaEye className="text-purple-600 text-xl" />
            </div>
            <div className="mr-4">
              <p className="text-sm text-gray-500">بازدید این ماه</p>
              <p className="text-xl font-bold">{summaryData.viewsThisMonth}</p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* More Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardBody>
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <FaBuilding className="text-blue-600" />
              <span>وضعیت ملک‌ها</span>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">فروشی</p>
                <p className="text-xl font-bold text-blue-600">
                  {summaryData.activeSales}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">اجاره‌ای</p>
                <p className="text-xl font-bold text-orange-600">
                  {summaryData.activeRentals}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">نسبت فروش به اجاره</p>
                <p className="text-xl font-bold text-green-600">
                  {summaryData.activeSales && summaryData.activeRentals
                    ? (
                        (summaryData.activeSales /
                          (summaryData.activeSales +
                            summaryData.activeRentals)) *
                        100
                      ).toFixed(0)
                    : 0}
                  %
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">میانگین بازدید/ملک</p>
                <p className="text-xl font-bold text-purple-600">
                  {summaryData.totalListings
                    ? Math.round(
                        summaryData.viewsThisMonth / summaryData.totalListings
                      )
                    : 0}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <FaChartLine className="text-green-600" />
              <span>آمار معاملات</span>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">درخواست‌ها</p>
                <p className="text-xl font-bold text-yellow-600">
                  {summaryData.inquiriesThisMonth}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">معاملات موفق</p>
                <p className="text-xl font-bold text-green-600">
                  {summaryData.successfulDeals}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">نرخ تبدیل</p>
                <p className="text-xl font-bold text-blue-600">
                  {summaryData.inquiriesThisMonth
                    ? (
                        (summaryData.successfulDeals /
                          summaryData.inquiriesThisMonth) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">معاملات این ماه</p>
                <p className="text-xl font-bold text-indigo-600">
                  {monthlyData[new Date().getMonth()].value}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Monthly Data Table */}
      <Card>
        <CardBody>
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
            <FaChartLine className="text-blue-600" />
            <span>
              {dataType === "listings"
                ? "آمار ماهانه ملک‌ها"
                : dataType === "deals"
                ? "آمار ماهانه معاملات"
                : "آمار ماهانه بازدیدها"}
            </span>
          </h3>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Spinner color="primary" size="lg" />
            </div>
          ) : (
            <Table
              aria-label="جدول آمار ماهانه"
              classNames={{
                table: "min-w-full",
              }}
            >
              <TableHeader>
                <TableColumn className="text-right font-bold">ماه</TableColumn>
                <TableColumn className="text-right font-bold">
                  {dataType === "listings"
                    ? "تعداد ملک‌ها"
                    : dataType === "deals"
                    ? "تعداد معاملات"
                    : "تعداد بازدیدها"}
                </TableColumn>
                <TableColumn className="text-right font-bold">
                  درصد تغییر
                </TableColumn>
              </TableHeader>
              <TableBody>
                {monthlyData.map((data, index) => {
                  const prevMonth =
                    index > 0 ? monthlyData[index - 1].value : data.value;
                  const changePercent = prevMonth
                    ? ((data.value - prevMonth) / prevMonth) * 100
                    : 0;
                  const isPositive = changePercent >= 0;

                  return (
                    <TableRow key={data.month}>
                      <TableCell className="font-medium">
                        {data.month}
                      </TableCell>
                      <TableCell>{data.value.toLocaleString()}</TableCell>
                      <TableCell>
                        <span
                          className={`flex items-center gap-1 ${
                            isPositive ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {isPositive ? "+" : ""}
                          {changePercent.toFixed(1)}%
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardBody>
      </Card>

      {/* Agency Comparison */}
      {selectedAgencyId === "all" && (
        <Card>
          <CardBody>
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <FaExclamationCircle className="text-yellow-600" />
              <span>مقایسه آژانس‌ها</span>
            </h3>

            <Table
              aria-label="جدول مقایسه آژانس‌ها"
              classNames={{
                table: "min-w-full",
              }}
            >
              <TableHeader>
                <TableColumn className="text-right font-bold">
                  نام آژانس
                </TableColumn>
                <TableColumn className="text-right font-bold">
                  تعداد ملک‌ها
                </TableColumn>
                <TableColumn className="text-right font-bold">
                  تعداد معاملات
                </TableColumn>
                <TableColumn className="text-right font-bold">
                  بازدیدها
                </TableColumn>
                <TableColumn className="text-right font-bold">
                  نرخ تبدیل
                </TableColumn>
              </TableHeader>
              <TableBody>
                {initialAgencies.map((agency) => {
                  const conversionRate = agency.stats.inquiriesThisMonth
                    ? (
                        (agency.stats.successfulDeals /
                          agency.stats.inquiriesThisMonth) *
                        100
                      ).toFixed(1)
                    : "0";

                  return (
                    <TableRow key={agency.id}>
                      <TableCell className="font-medium">
                        {agency.name}
                      </TableCell>
                      <TableCell>
                        {agency.stats.totalListings.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {agency.stats.successfulDeals.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {agency.stats.viewsThisMonth.toLocaleString()}
                      </TableCell>
                      <TableCell>{conversionRate}%</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
