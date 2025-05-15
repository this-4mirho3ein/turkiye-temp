"use client";
import { useState, useEffect } from "react";
import PropertyList from "./PropertyList";
import { Property } from "@/types/interfaces";
import { Button } from "@heroui/react";

const ITEMS_PER_PAGE = 9;

const PropertyListing = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProperties = async (page: number) => {
    try {
      setIsLoading(true);
      setError(null);

      // Replace this with your actual API call
      const response = await fetch(
        `/api/properties?page=${page}&limit=${ITEMS_PER_PAGE}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch properties");
      }

      setProperties(data.properties);
      setTotalPages(Math.ceil(data.total / ITEMS_PER_PAGE));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PropertyList
        properties={properties}
        isLoading={isLoading}
        error={error}
      />

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-2 mt-8">
        <Button
          onPress={() => handlePageChange(currentPage - 1)}
          isDisabled={currentPage === 1}
          variant="light"
        >
          قبلی
        </Button>

        <span className="text-gray-600">
          صفحه {currentPage} از {totalPages}
        </span>

        <Button
          onPress={() => handlePageChange(currentPage + 1)}
          isDisabled={currentPage === totalPages}
          variant="light"
        >
          بعدی
        </Button>
      </div>
    </div>
  );
};

export default PropertyListing;
