"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Spinner,
  Select,
  SelectItem,
  Input,
  Button,
  Progress,
} from "@heroui/react";
import {
  FaSearch,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaTrashAlt,
  FaChartBar,
} from "react-icons/fa";
import { Agency, Review } from "../data/agencies";

interface AgencyRatingsProps {
  initialAgencies: Agency[];
}

export default function AgencyRatings({ initialAgencies }: AgencyRatingsProps) {
  const [agencies, setAgencies] = useState<Agency[]>(initialAgencies);
  const [filteredAgencies, setFilteredAgencies] =
    useState<Agency[]>(initialAgencies);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);

  // Handle search and filtering
  useEffect(() => {
    setIsLoading(true);

    let filtered = [...agencies];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (agency) =>
          agency.name.toLowerCase().includes(term) ||
          agency.city.toLowerCase().includes(term)
      );
    }

    // Apply rating filter
    if (ratingFilter !== "all") {
      const minRating = parseInt(ratingFilter);
      filtered = filtered.filter(
        (agency) => agency.rating >= minRating && agency.rating < minRating + 1
      );
    }

    setFilteredAgencies(filtered);
    setCurrentPage(1);
    setIsLoading(false);
  }, [searchTerm, ratingFilter, agencies]);

  // Calculate pagination
  const pages = Math.ceil(filteredAgencies.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedAgencies = filteredAgencies.slice(startIndex, endIndex);

  // Render star rating
  const renderStarRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-gray-300" />);
      }
    }

    return <div className="flex items-center">{stars}</div>;
  };

  // Rating distribution calculation for selected agency
  const getRatingDistribution = () => {
    if (!selectedAgency) return Array(5).fill(0);

    const distribution = Array(5).fill(0);
    selectedAgency.reviews.forEach((review) => {
      const index = Math.floor(review.rating) - 1;
      if (index >= 0 && index < 5) {
        distribution[index]++;
      }
    });

    return distribution;
  };

  // Calculate percentage for each rating
  const calculateRatingPercentage = (count: number) => {
    if (!selectedAgency || selectedAgency.reviews.length === 0) return 0;
    return Math.round((count / selectedAgency.reviews.length) * 100);
  };

  const ratingDistribution = getRatingDistribution();

  return (
    <div className="space-y-6">
      {/* Top section with filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          placeholder="جستجوی آژانس..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          startContent={<FaSearch className="text-gray-400" />}
        />

        <Select
          placeholder="فیلتر امتیاز"
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
        >
          <SelectItem value="all">تمام امتیازات</SelectItem>
          <SelectItem value="5">5 ستاره</SelectItem>
          <SelectItem value="4">4 ستاره</SelectItem>
          <SelectItem value="3">3 ستاره</SelectItem>
          <SelectItem value="2">2 ستاره</SelectItem>
          <SelectItem value="1">1 ستاره</SelectItem>
        </Select>
      </div>

      {/* Content area with two sections when an agency is selected */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Agencies rating list */}
        <div
          className={`bg-white rounded-lg overflow-hidden ${
            selectedAgency ? "lg:col-span-7" : "lg:col-span-12"
          }`}
        >
          <Table
            aria-label="جدول امتیازات آژانس‌ها"
            classNames={{
              base: "min-h-[400px]",
              table: "min-w-full",
            }}
          >
            <TableHeader>
              <TableColumn width={60} className="text-right">
                ردیف
              </TableColumn>
              <TableColumn className="text-right">نام آژانس</TableColumn>
              <TableColumn className="text-right">شهر</TableColumn>
              <TableColumn className="text-right">میانگین امتیاز</TableColumn>
              <TableColumn className="text-right">تعداد نظرات</TableColumn>
              <TableColumn className="text-right">عملیات</TableColumn>
            </TableHeader>

            <TableBody
              isLoading={isLoading}
              loadingContent={<Spinner color="primary" />}
              emptyContent="هیچ آژانسی یافت نشد"
            >
              {paginatedAgencies.map((agency, index) => (
                <TableRow
                  key={agency.id}
                  className={
                    selectedAgency?.id === agency.id ? "bg-blue-50" : ""
                  }
                >
                  <TableCell>{startIndex + index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {agency.logo && (
                        <img
                          src={agency.logo}
                          alt={agency.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      )}
                      <span className="font-medium">{agency.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{agency.city}</TableCell>
                  <TableCell>{renderStarRating(agency.rating)}</TableCell>
                  <TableCell>{agency.reviewsCount}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      color={
                        selectedAgency?.id === agency.id ? "primary" : "default"
                      }
                      variant={
                        selectedAgency?.id === agency.id ? "solid" : "light"
                      }
                      onClick={() =>
                        setSelectedAgency(
                          selectedAgency?.id === agency.id ? null : agency
                        )
                      }
                      startContent={<FaChartBar />}
                    >
                      {selectedAgency?.id === agency.id
                        ? "بستن جزئیات"
                        : "مشاهده جزئیات"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex justify-between items-center p-4">
            <div className="text-sm text-gray-600">
              نمایش {startIndex + 1} تا{" "}
              {Math.min(endIndex, filteredAgencies.length)} از{" "}
              {filteredAgencies.length} آژانس
            </div>

            <Pagination
              total={pages}
              page={currentPage}
              onChange={setCurrentPage}
              color="primary"
              showControls
            />
          </div>
        </div>

        {/* Agency Rating Details */}
        {selectedAgency && (
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-bold mb-4 pb-2 border-b">
                جزئیات امتیازات {selectedAgency.name}
              </h3>

              {/* Rating summary */}
              <div className="flex items-center justify-center mb-6">
                <div className="text-center ml-6">
                  <div className="text-3xl font-bold text-gray-800">
                    {selectedAgency.rating}
                  </div>
                  <div className="flex justify-center mt-1">
                    {renderStarRating(selectedAgency.rating)}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    از {selectedAgency.reviewsCount} نظر
                  </div>
                </div>

                {/* Rating distribution */}
                <div className="flex-1">
                  {[5, 4, 3, 2, 1].map((star, index) => {
                    const count = ratingDistribution[5 - star];
                    const percentage = calculateRatingPercentage(count);

                    return (
                      <div key={star} className="flex items-center my-1">
                        <span className="w-8 text-xs text-gray-600">
                          {star}
                        </span>
                        <FaStar className="text-yellow-400 mr-1" />
                        <Progress
                          value={percentage}
                          color="warning"
                          className="flex-1 mx-2 h-2"
                        />
                        <span className="text-xs text-gray-600 w-12">
                          {percentage}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent reviews */}
              <h4 className="font-medium mb-3">آخرین نظرات</h4>
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {selectedAgency.reviews && selectedAgency.reviews.length > 0 ? (
                  selectedAgency.reviews.map((review) => (
                    <div key={review.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{review.userName}</p>
                          <div className="flex items-center mt-1">
                            {renderStarRating(review.rating)}
                            <span className="text-xs text-gray-500 mr-2">
                              {review.date}
                            </span>
                          </div>
                        </div>
                        <button className="text-red-500 hover:text-red-700">
                          <FaTrashAlt />
                        </button>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">
                        {review.comment}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    هیچ نظری ثبت نشده است
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
