"use client";

import { useState, useCallback } from "react";
import Card from "@/components/admin/ui/Card";
import FilterTable, { AdminFilter } from "./FilterTable";
import FilterFormModal from "./FilterFormModal";
import DeleteFilterModal from "./DeleteFilterModal";
import FilterSearch from "./FilterSearch";
import { Button, Checkbox } from "@heroui/react";
import { FaPlus, FaSync } from "react-icons/fa";
import {
  getAdminFilters,
  createAdminFilter,
  updateAdminFilter,
  deleteAdminFilter,
  restoreAdminFilter,
} from "@/controllers/makeRequest";
import { useToast } from "@/components/admin/ui/ToastProvider";
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query";
import { useApi } from "@/hooks/useApi";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 1000, // 10 seconds
    },
  },
});

// Define the fetchers for the API
const fetchers = {
  "admin-filters": getAdminFilters,
};

// Inner component that uses React Query hooks
function FiltersPageClientInner() {
  const [selectedFilter, setSelectedFilter] = useState<AdminFilter | null>(
    null
  );
  const [filterToDelete, setFilterToDelete] = useState<AdminFilter | null>(
    null
  );
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showDeletedItems, setShowDeletedItems] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const queryClient = useQueryClient();
  const { showToast } = useToast();

  // Fetch filters using the useApi hook
  const {
    data: filters = [],
    isLoading,
    error,
    refetch: refetchFilters,
  } = useApi<AdminFilter[]>(
    "admin-filters",
    fetchers,
    {
      page: 1,
      limit: 100,
      forceRefresh: refreshTrigger > 0,
      ...(searchTerm && { search: searchTerm }),
    },
    true
  );

  // Apply client-side filtering for filters
  const displayFilters = filters.filter((filter) => {
    // Filter by deleted status
    if (!showDeletedItems && filter.isDeleted) {
      return false;
    }

    // Apply search term filter (client-side fallback)
    if (
      searchTerm &&
      !filter.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !filter.enName.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  // Function to force refresh data
  const refreshData = useCallback(async () => {
    console.log("🔄 Forcing refresh of filters data...");

    // Invalidate the cache
    await queryClient.invalidateQueries({ queryKey: ["admin-filters"] });

    // Increment refresh trigger to cause re-render
    setRefreshTrigger((prev) => prev + 1);

    // Show success toast
    showToast({
      message: "اطلاعات فیلترها با موفقیت به‌روزرسانی شد",
      type: "success",
    });
  }, [queryClient, showToast]);

  // Handle opening form modal for add/edit
  const handleAddEdit = (filter: AdminFilter | null = null) => {
    setSelectedFilter(filter);
    setIsFormModalOpen(true);
  };

  // Handle opening delete confirmation modal
  const handleDelete = (filter: AdminFilter) => {
    setFilterToDelete(filter);
    setIsDeleteModalOpen(true);
  };

  // Handle restoring a deleted filter
  const handleRestore = async (filter: AdminFilter) => {
    if (!filter._id) return;

    setIsSubmitting(true);
    try {
      const response = await restoreAdminFilter(filter._id);

      if (response.success) {
        showToast({
          message: "فیلتر با موفقیت بازیابی شد",
          type: "success",
        });

        await refreshData();
      } else {
        showToast({
          message: response.message || "بازیابی فیلتر با خطا مواجه شد",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error restoring filter:", error);
      showToast({
        message: "عملیات با خطا مواجه شد. لطفاً مجدداً تلاش کنید",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle saving (creating or updating) a filter
  const handleSave = async (data: Partial<AdminFilter>) => {
    setIsSubmitting(true);
    try {
      if (selectedFilter) {
        // Update existing filter
        const response = await updateAdminFilter(selectedFilter._id, data);

        if (response.success) {
          showToast({
            message: "فیلتر با موفقیت به‌روزرسانی شد",
            type: "success",
          });
        } else {
          showToast({
            message: response.message || "به‌روزرسانی فیلتر با خطا مواجه شد",
            type: "error",
          });
        }
      } else {
        // Create new filter
        const response = await createAdminFilter(data);

        if (response.success) {
          showToast({
            message: "فیلتر با موفقیت ایجاد شد",
            type: "success",
          });
        } else {
          showToast({
            message: response.message || "ایجاد فیلتر با خطا مواجه شد",
            type: "error",
          });
        }
      }

      setIsFormModalOpen(false);
      setSelectedFilter(null);
      await refreshData();
    } catch (error) {
      console.error("Error saving filter:", error);
      showToast({
        message: "عملیات با خطا مواجه شد. لطفاً مجدداً تلاش کنید",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle confirming delete
  const handleConfirmDelete = async () => {
    if (!filterToDelete?._id) return;

    setIsSubmitting(true);
    try {
      const response = await deleteAdminFilter(filterToDelete._id);

      if (response.success) {
        showToast({
          message: "فیلتر با موفقیت حذف شد",
          type: "success",
        });

        setIsDeleteModalOpen(false);
        setFilterToDelete(null);
        await refreshData();
      } else {
        showToast({
          message: response.message || "حذف فیلتر با خطا مواجه شد",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error deleting filter:", error);
      showToast({
        message: "عملیات با خطا مواجه شد. لطفاً مجدداً تلاش کنید",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">مدیریت فیلترها</h1>
        <div className="flex gap-3">
          <Button
            color="primary"
            startContent={<FaPlus />}
            onPress={() => handleAddEdit()}
            isDisabled={isSubmitting}
          >
            افزودن فیلتر جدید
          </Button>
          <Button
            color="default"
            variant="bordered"
            startContent={<FaSync />}
            onPress={refreshData}
            isDisabled={isSubmitting}
          >
            به‌روزرسانی
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="p-4 space-y-4">
          <FilterSearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          <div className="flex items-center gap-4">
            <Checkbox
              isSelected={showDeletedItems}
              onValueChange={setShowDeletedItems}
            >
              نمایش فیلترهای حذف شده
            </Checkbox>
            <span className="text-sm text-gray-500">
              {displayFilters.length} فیلتر یافت شد
            </span>
          </div>
        </div>
      </Card>

      {/* Filters Table */}
      <Card>
        <FilterTable
          filters={displayFilters}
          isLoading={isLoading}
          onEdit={handleAddEdit}
          onDelete={handleDelete}
          onRestore={handleRestore}
          isSubmitting={isSubmitting}
        />
      </Card>

      {/* Form Modal */}
      <FilterFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedFilter(null);
        }}
        onSave={handleSave}
        filter={selectedFilter}
        isSubmitting={isSubmitting}
      />

      {/* Delete Modal */}
      <DeleteFilterModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setFilterToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        filter={filterToDelete}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

export default function FiltersPageClient() {
  return (
    <QueryClientProvider client={queryClient}>
      <FiltersPageClientInner />
    </QueryClientProvider>
  );
}
