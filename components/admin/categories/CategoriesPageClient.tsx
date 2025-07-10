"use client";

import { useState, useEffect, useCallback } from "react";
import Card from "@/components/admin/ui/Card";
import CategoryTable, { Category } from "./CategoryTable";
import CategoryFormModal from "./CategoryFormModal";
import DeleteCategoryModal from "./DeleteCategoryModal";
import CategorySearch from "./CategorySearch";
import { Button, Checkbox } from "@heroui/react";
import { FaPlus, FaSync, FaLayerGroup, FaFilter } from "react-icons/fa";
import {
  getAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
  restoreAdminCategory,
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
  "admin-categories": getAdminCategories,
};

// Inner component that uses React Query hooks
function CategoriesPageClientInner() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
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

  // Fetch categories using the useApi hook
  const {
    data: categories = [],
    isLoading,
    error,
    refetch: refetchCategories,
  } = useApi<Category[]>(
    "admin-categories",
    fetchers,
    {
      page: 1,
      limit: 100,
      forceRefresh: refreshTrigger > 0,
      ...(searchTerm && { search: searchTerm }),
    },
    true
  );

  // Apply client-side filtering for categories
  const displayCategories = categories.filter((category) => {
    // Filter by deleted status
    if (!showDeletedItems && category.isDeleted) {
      return false;
    }

    // Apply search term filter (client-side fallback)
    if (
      searchTerm &&
      !category.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  // Log any errors
  useEffect(() => {
    if (error) {
      console.error("Error fetching categories:", error);
      showToast({
        message: "دریافت لیست دسته‌بندی‌ها با خطا مواجه شد",
        type: "error",
      });
    }
  }, [error, showToast]);

  // Function to force refresh data
  const refreshData = useCallback(async () => {

    // Invalidate the cache
    await queryClient.invalidateQueries({ queryKey: ["admin-categories"] });

    // Try direct API call with force refresh
    try {
      await getAdminCategories({ forceRefresh: true });
    } catch (error) {
      console.error("Error during forced refresh:", error);
    }

    // Increment refresh trigger to cause re-render
    setRefreshTrigger((prev) => prev + 1);

    // Show success toast
    showToast({
      message: "اطلاعات دسته‌بندی‌ها با موفقیت به‌روزرسانی شد",
      type: "success",
    });
  }, [queryClient, showToast]);

  // Handle opening form modal for add/edit
  const handleAddEdit = (category: Category | null = null) => {
    setSelectedCategory(category);
    setIsFormModalOpen(true);
  };

  // Handle opening delete confirmation modal
  const handleDelete = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  // Handle restoring a deleted category
  const handleRestore = async (category: Category) => {
    if (!category._id) return;

    setIsSubmitting(true);
    try {
      const response = await restoreAdminCategory(category._id);

      if (response.success) {
        showToast({
          message: "دسته‌بندی با موفقیت بازیابی شد",
          type: "success",
        });

        await refreshData();
      } else {
        showToast({
          message: response.message || "بازیابی دسته‌بندی با خطا مواجه شد",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error restoring category:", error);
      showToast({
        message: "عملیات با خطا مواجه شد. لطفاً مجدداً تلاش کنید",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle saving (creating or updating) a category
  const handleSave = async (data: Partial<Category>) => {
    setIsSubmitting(true);
    try {
      if (selectedCategory) {
        // Update existing category
        const response = await updateAdminCategory(selectedCategory._id, {
          name: data.name || "",
          enName: data.enName || "",
          row: data.row || 1,
          propertyType: data.propertyType || "",
          isActive: data.isActive !== undefined ? data.isActive : true,
        });

        if (response.success) {
          showToast({
            message: "دسته‌بندی با موفقیت به‌روزرسانی شد",
            type: "success",
          });

          // Close modal and refresh data
          setIsFormModalOpen(false);
          await refreshData();
        } else {
          showToast({
            message:
              response.message || "به‌روزرسانی دسته‌بندی با خطا مواجه شد",
            type: "error",
          });
        }
      } else {
        // Create new category
        const response = await createAdminCategory({
          name: data.name || "",
          enName: data.enName || "",
          row: data.row || 1,
          propertyType: data.propertyType || "",
          isActive: data.isActive !== undefined ? data.isActive : true,
        });

        if (response.success) {
          showToast({
            message: "دسته‌بندی جدید با موفقیت ایجاد شد",
            type: "success",
          });

          // Close modal and refresh data
          setIsFormModalOpen(false);
          await refreshData();
        } else {
          showToast({
            message: response.message || "ایجاد دسته‌بندی با خطا مواجه شد",
            type: "error",
          });
        }
      }
    } catch (error) {
      console.error("Error saving category:", error);
      showToast({
        message: "عملیات با خطا مواجه شد. لطفاً مجدداً تلاش کنید",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle confirming deletion
  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;

    setIsSubmitting(true);
    try {
      const response = await deleteAdminCategory(categoryToDelete._id);

      if (response.success) {
        showToast({
          message: "دسته‌بندی با موفقیت حذف شد",
          type: "success",
        });

        // Close modal and refresh data
        setIsDeleteModalOpen(false);
        await refreshData();
      } else {
        showToast({
          message: response.message || "حذف دسته‌بندی با خطا مواجه شد",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error deleting category:", error);
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
      {/* هدر صفحه */}
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center">
          <FaLayerGroup className="text-primary ml-3 text-xl" />
          <h1 className="text-2xl font-bold">مدیریت دسته‌بندی‌ها</h1>
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
            <FaPlus /> افزودن دسته‌بندی
          </Button>
        </div>
      </div>

      {/* جستجو */}
      <CategorySearch
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearch={() => {
          setRefreshTrigger((prev) => prev + 1);
        }}
        isLoading={isLoading}
      />

      {/* فیلترها */}
      <div className="bg-white p-4 rounded-lg shadow-sm border-t-4 border-purple-500">
        <div className="font-bold text-gray-700 mb-3 flex items-center">
          <FaFilter className="ml-2 text-purple-500" />
          فیلترها
        </div>
        <div className="flex items-center">
          <Checkbox
            checked={showDeletedItems}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setShowDeletedItems(e.target.checked)
            }
            className="ml-2 text-purple-500"
          />
          <label className="mb-0 text-sm cursor-pointer">
            نمایش موارد حذف شده
          </label>
        </div>
      </div>

      <Card shadow="sm">
        <div className="p-4">
          <CategoryTable
            categories={displayCategories}
            onEdit={handleAddEdit}
            onDelete={handleDelete}
            onRestore={handleRestore}
            isLoading={isLoading}
            showDeletedItems={showDeletedItems}
          />
        </div>
      </Card>

      {/* Form Modal for Add/Edit */}
      <CategoryFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSave}
        category={selectedCategory}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <DeleteCategoryModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        category={categoryToDelete}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

// Wrapper component that provides QueryClient context
export default function CategoriesPageClient() {
  return (
    <QueryClientProvider client={queryClient}>
      <CategoriesPageClientInner />
    </QueryClientProvider>
  );
}
