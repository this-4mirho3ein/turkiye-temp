"use client";

import { useState, useEffect, useCallback } from "react";
import Card, { CardBody } from "@/components/admin/ui/Card";
import PropertyTypeTable, { PropertyType } from "./PropertyTypeTable";
import PropertyTypeFormModal from "./PropertyTypeFormModal";
import DeletePropertyTypeModal from "./DeletePropertyTypeModal";
import { Button, addToast, Checkbox } from "@heroui/react";
import { FaPlus, FaSync, FaListAlt, FaFilter } from "react-icons/fa";
import {
  getAdminPropertyTypes,
  createAdminPropertyType,
  updateAdminPropertyType,
  deleteAdminPropertyType,
} from "@/controllers/makeRequest";
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
  "admin-property-types": getAdminPropertyTypes,
};

// Inner component that uses React Query hooks
function PropertyTypesPageClientInner() {
  const [selectedPropertyType, setSelectedPropertyType] =
    useState<PropertyType | null>(null);
  const [propertyTypeToDelete, setPropertyTypeToDelete] =
    useState<PropertyType | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showDeletedItems, setShowDeletedItems] = useState(false);

  const queryClient = useQueryClient();

  // Fetch property types using the useApi hook
  const {
    data: propertyTypes = [],
    isLoading,
    error,
    refetch: refetchPropertyTypes,
  } = useApi<PropertyType[]>(
    "admin-property-types",
    fetchers,
    { page: 1, limit: 100, forceRefresh: refreshTrigger > 0 },
    true
  );

  // Sort property types by row in ascending order
  const sortedPropertyTypes = [...propertyTypes].sort((a, b) => a.row - b.row);

  // Log any errors
  useEffect(() => {
    if (error) {
      console.error("Error fetching property types:", error);
      addToast({
        title: "خطا در دریافت اطلاعات",
        description: "دریافت لیست انواع کاربری با خطا مواجه شد",
      });
    }
  }, [error]);

  // Function to force refresh data
  const refreshData = useCallback(async () => {

    // Invalidate the cache
    await queryClient.invalidateQueries({ queryKey: ["admin-property-types"] });

    // Try direct API call with force refresh
    try {
      await getAdminPropertyTypes({ forceRefresh: true });
    } catch (error) {
      console.error("Error during forced refresh:", error);
    }

    // Increment refresh trigger to cause re-render
    setRefreshTrigger((prev) => prev + 1);

  }, [queryClient]);

  // Handle opening form modal for add/edit
  const handleAddEdit = (propertyType: PropertyType | null = null) => {
    setSelectedPropertyType(propertyType);
    setIsFormModalOpen(true);
  };

  // Handle opening delete confirmation modal
  const handleDelete = (propertyType: PropertyType) => {
    setPropertyTypeToDelete(propertyType);
    setIsDeleteModalOpen(true);
  };

  // Handle saving (creating or updating) a property type
  const handleSave = async (data: Partial<PropertyType>) => {
    setIsSubmitting(true);
    try {
      if (selectedPropertyType) {
        // Update existing property type
        const response = await updateAdminPropertyType(
          selectedPropertyType._id,
          {
            type: data.type || "",
            enName: data.enName || "",
            row: data.row || 1,
            isActive: data.isActive !== undefined ? data.isActive : true,
          }
        );

        if (response.success) {
          // Close modal and refresh data
          setIsFormModalOpen(false);
          await refreshData();

          // Return the response
          return response;
        } else {
          addToast({
            title: "خطا",
            description:
              response.message || "به‌روزرسانی نوع کاربری با خطا مواجه شد",
          });

          // Return the error response
          return response;
        }
      } else {
        // Create new property type
        const response = await createAdminPropertyType({
          type: data.type || "",
          enName: data.enName || "",
          row: data.row || 1,
          isActive: data.isActive !== undefined ? data.isActive : true,
        });

        if (response.success) {
          // Close modal and refresh data
          setIsFormModalOpen(false);
          await refreshData();

          // Return the response
          return response;
        } else {
          addToast({
            title: "خطا",
            description: response.message || "ایجاد نوع کاربری با خطا مواجه شد",
          });

          // Return the error response
          return response;
        }
      }
    } catch (error) {
      console.error("Error saving property type:", error);
      addToast({
        title: "خطا",
        description: "عملیات با خطا مواجه شد. لطفاً مجدداً تلاش کنید",
      });

      // Return an error object
      return { success: false, message: "خطای سیستمی در انجام عملیات" };
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle confirming deletion
  const handleConfirmDelete = async () => {
    if (!propertyTypeToDelete) return;

    setIsSubmitting(true);
    try {
      const response = await deleteAdminPropertyType(propertyTypeToDelete._id);

      if (response.success) {
        addToast({
          title: "عملیات موفق",
          description: response.message || "نوع کاربری با موفقیت حذف شد",
        });

        // Close modal and refresh data
        setIsDeleteModalOpen(false);
        await refreshData();
      } else {
        addToast({
          title: "خطا",
          description: response.message || "حذف نوع کاربری با خطا مواجه شد",
        });
      }
    } catch (error) {
      console.error("Error deleting property type:", error);
      addToast({
        title: "خطا",
        description: "عملیات با خطا مواجه شد. لطفاً مجدداً تلاش کنید",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // آمار و اطلاعات خلاصه
  const totalCount = propertyTypes.length;
  const activeCount = propertyTypes.filter(
    (item) => item.isActive && !item.isDeleted
  ).length;
  const deletedCount = propertyTypes.filter((item) => item.isDeleted).length;

  return (
    <div className="space-y-6">
      {/* هدر صفحه */}
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center">
          <FaListAlt className="text-primary ml-3 text-xl" />
          <h1 className="text-2xl font-bold">مدیریت انواع کاربری</h1>
        </div>
        <div className="flex gap-3">
          <Button
            variant="flat"
            color="default"
            onClick={refreshData}
            className="gap-1.5 hover:bg-gray-200 transition-colors"
          >
            <FaSync /> به‌روزرسانی
          </Button>
          <Button
            color="primary"
            onClick={() => handleAddEdit()}
            className="gap-1.5 bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <FaPlus /> افزودن نوع کاربری
          </Button>
        </div>
      </div>

      {/* فیلترها */}
      <div className="bg-white p-4 rounded-lg shadow-sm border-t-4 border-purple-500">
        <div className="font-bold text-gray-700 mb-3 flex items-center">
          <FaFilter className="ml-2 text-purple-500" />
          فیلترها
        </div>
        <div className="flex items-center">
          <Checkbox
            checked={showDeletedItems}
            onChange={(e) => setShowDeletedItems(e.target.checked)}
            className="ml-2 text-purple-500"
          />
          <label className="mb-0 text-sm cursor-pointer">
            نمایش موارد حذف شده
          </label>
        </div>
      </div>

      <Card shadow="sm">
        <CardBody>
          <PropertyTypeTable
            propertyTypes={sortedPropertyTypes}
            onEdit={handleAddEdit}
            onDelete={handleDelete}
            isLoading={isLoading}
            showDeletedItems={showDeletedItems}
          />
        </CardBody>
      </Card>

      {/* Form Modal for Add/Edit */}
      <PropertyTypeFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSave}
        propertyType={selectedPropertyType}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <DeletePropertyTypeModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        propertyType={propertyTypeToDelete}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

// Wrapper component that provides QueryClient context
export default function PropertyTypesPageClient() {
  return (
    <QueryClientProvider client={queryClient}>
      <PropertyTypesPageClientInner />
    </QueryClientProvider>
  );
}
