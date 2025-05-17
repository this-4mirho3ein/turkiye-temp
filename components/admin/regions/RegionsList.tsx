"use client";

import { useState, useEffect } from "react";
import {
  FaExclamationTriangle,
  FaCheck,
  FaTrash,
  FaGlobe,
  FaMapMarkedAlt,
  FaCity,
  FaMapPin,
} from "react-icons/fa";
import { Modal, useDisclosure, addToast } from "@heroui/react";
import { Region } from "@/components/admin/data/regions";
import {
  createAdminCountry,
  updateAdminCountry,
  deleteAdminCountry,
  createAdminProvince,
  updateAdminProvince,
  deleteAdminProvince,
  createAdminCity,
  updateAdminCity,
  deleteAdminCity,
  createAdminArea,
  updateAdminArea,
  deleteAdminArea,
  getAdminCountries,
  getAdminProvinces,
  getAdminCities,
  getAdminAreas,
} from "@/controllers/makeRequest";
import { useQueryClient } from "@tanstack/react-query";
import RegionSearchBar from "./RegionSearchBar";
import RegionsTable from "./RegionsTable";
import RegionFormModal from "./RegionFormModal";
import DeleteRegionModal from "./DeleteRegionModal";

interface RegionsListProps {
  type: "countries" | "provinces" | "cities" | "areas";
  initialRegions: Region[];
  parentRegions: Region[];
  isLoading?: boolean;
  onDataChange?: () => void; // Callback for when data changes
}

export default function RegionsList({
  type,
  initialRegions,
  parentRegions,
  isLoading = false,
  onDataChange,
}: RegionsListProps) {
  const [regions, setRegions] = useState<Region[]>(initialRegions);
  const [search, setSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [regionToDelete, setRegionToDelete] = useState<Region | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    parentId: "",
    enName: "",
    code: "",
    phoneCode: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set the API action based on region type
  const apiActions = {
    countries: {
      create: createAdminCountry,
      update: updateAdminCountry,
      delete: deleteAdminCountry,
    },
    provinces: {
      create: createAdminProvince,
      update: updateAdminProvince,
      delete: deleteAdminProvince,
    },
    cities: {
      create: createAdminCity,
      update: updateAdminCity,
      delete: deleteAdminCity,
    },
    areas: {
      create: createAdminArea,
      update: updateAdminArea,
      delete: deleteAdminArea,
    },
  };

  const {
    isOpen: isFormModalOpen,
    onOpen: onFormModalOpen,
    onClose: onFormModalClose,
  } = useDisclosure();

  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure();

  const queryClient = useQueryClient();

  // Update regions when initialRegions changes (e.g., from parent component)
  useEffect(() => {
    setRegions(initialRegions);
  }, [initialRegions]);

  // Update form data when selected region changes
  useEffect(() => {
    if (selectedRegion) {
      setFormData({
        name: selectedRegion.name,
        slug: selectedRegion.slug,
        parentId:
          selectedRegion.parent?.originalId ||
          selectedRegion.parent?.id.toString() ||
          "",
        enName: selectedRegion.enName || "",
        code: selectedRegion.code || "",
        phoneCode: selectedRegion.phoneCode || "",
      });
    } else {
      setFormData({
        name: "",
        slug: "",
        parentId: "",
        enName: "",
        code: "",
        phoneCode: "",
      });
    }
  }, [selectedRegion]);

  // Client-side filtering based on search input
  const filteredRegions = search.trim()
    ? regions.filter(
        (region) =>
          region.name.toLowerCase().includes(search.toLowerCase()) ||
          region.slug.toLowerCase().includes(search.toLowerCase())
      )
    : regions;

  // Generate a random code for countries (numeric)
  const generateRandomCode = (): string => {
    // Generate a random number between 10 and 999
    return Math.floor(Math.random() * 990 + 10).toString();
  };

  // Generate a slug from English name
  const generateSlugFromEnglishName = (enName: string): string => {
    return enName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with hyphens
      .replace(/^-|-$/g, "") // Remove leading/trailing hyphens
      .substring(0, 50); // Limit length
  };

  const handleAddEdit = (region: Region | null = null) => {
    setSelectedRegion(region);
    onFormModalOpen();
  };

  const handleDeleteClick = (region: Region) => {
    setRegionToDelete(region);
    onDeleteModalOpen();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Update form data
    setFormData((prev) => {
      const newFormData = { ...prev, [name]: value };

      // Auto-generate slug from English name for all types
      if (name === "enName" && value) {
        newFormData.slug = generateSlugFromEnglishName(value);
        console.log(
          `Auto-generated slug from English name: ${newFormData.slug}`
        );
      }

      return newFormData;
    });
  };

  const confirmDelete = async () => {
    if (regionToDelete) {
      setIsSubmitting(true);
      try {
        const deleteAction = apiActions[type].delete;
        // Use originalId if available, otherwise use numeric ID converted to string
        const regionId =
          regionToDelete.originalId || regionToDelete.id.toString();

        console.log(`Deleting ${type} with ID:`, regionId);
        const response = await deleteAction(regionId);
        console.log("Delete response:", response);

        if (response && response.success) {
          // Invalidate cache to refresh data
          await invalidateCache();

          // Notify parent component that data has changed
          if (onDataChange) {
            onDataChange();
          }

          addToast({
            title: "حذف موفقیت‌آمیز",
            description:
              response.message || `${regionToDelete.name} با موفقیت حذف شد`,
            color: "success",
            icon: <FaTrash />,
          });
          // Remove the deleted item from our local state
          setRegions((prev) => prev.filter((r) => r.id !== regionToDelete.id));
        } else {
          addToast({
            title: "خطا",
            description: response?.message || "حذف منطقه با مشکل مواجه شد",
            color: "danger",
            icon: <FaExclamationTriangle />,
          });
        }
      } catch (error) {
        console.error("Delete error:", error);
        let errorMessage = "حذف منطقه با مشکل مواجه شد";

        if (error && typeof error === "object" && "message" in error) {
          errorMessage = (error as any).message || errorMessage;
        }

        addToast({
          title: "خطا",
          description: errorMessage,
          color: "danger",
          icon: <FaExclamationTriangle />,
        });
      } finally {
        setIsSubmitting(false);
        onDeleteModalClose();
        setRegionToDelete(null);
      }
    }
  };

  const handleSave = async () => {
    // Validate required fields for all types - name and enName are required, slug is auto-generated
    if (!formData.name || !formData.enName) {
      addToast({
        title: "خطا",
        description: "لطفاً نام و نام انگلیسی را وارد کنید",
        color: "danger",
        icon: <FaExclamationTriangle />,
      });
      return;
    }

    // For countries, check if phoneCode is provided
    if (type === "countries" && !formData.phoneCode) {
      addToast({
        title: "خطا",
        description: "لطفاً کد تلفن کشور را نیز وارد کنید",
        color: "danger",
        icon: <FaExclamationTriangle />,
      });
      return;
    }

    // For other region types, check if a parent is selected
    if (type !== "countries" && !formData.parentId) {
      addToast({
        title: "خطا",
        description: `لطفاً ${
          type === "provinces" ? "کشور" : type === "cities" ? "استان" : "شهر"
        } مربوطه را انتخاب کنید`,
        color: "danger",
        icon: <FaExclamationTriangle />,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let response;

      if (type === "countries") {
        // Ensure slug is generated from English name
        const slug = generateSlugFromEnglishName(formData.enName);

        // For countries, directly use the typed object for API
        const countryData = {
          name: formData.name,
          slug: slug,
          enName: formData.enName || formData.name,
          code: generateRandomCode(), // Always generate random code
          phoneCode: formData.phoneCode,
        };

        if (selectedRegion) {
          // Update country
          const updateAction = apiActions.countries.update;
          // Use originalId if available, otherwise use numeric ID converted to string
          const regionId =
            selectedRegion.originalId || selectedRegion.id.toString();

          // For updates, use the existing code if available
          if (selectedRegion.code) {
            countryData.code = selectedRegion.code;
          }

          console.log(
            `Updating country with ID:`,
            regionId,
            "Data:",
            countryData
          );
          response = await updateAction(regionId, countryData);
          console.log("Update country response:", response);
        } else {
          // Create country - always generate a random code for new countries
          const createAction = apiActions.countries.create;
          console.log("Creating country with data:", countryData);
          response = await createAction(countryData);
          console.log("Create country response:", response);
        }
      } else {
        // For provinces, cities, and areas
        // Generate a random code for the new entity
        const code = generateRandomCode();

        // Get the parent key name based on the type
        const parentKey =
          type === "provinces"
            ? "country"
            : type === "cities"
            ? "province"
            : "city";

        // Ensure slug is generated from English name
        const slug = generateSlugFromEnglishName(formData.enName);

        // Create the data object with the proper parent field name
        const regionData: Record<string, any> = {
          name: formData.name,
          slug: slug,
          enName: formData.enName || formData.name,
          code: code,
        };

        // Add the parent ID with the correct key name
        if (formData.parentId) {
          // Use the original ID when available as it's what the backend expects
          regionData[parentKey] = formData.parentId;
        }

        if (selectedRegion) {
          // Update
          const updateAction = apiActions[type].update;
          // Use originalId if available, otherwise use numeric ID converted to string
          const regionId =
            selectedRegion.originalId || selectedRegion.id.toString();

          // For updates, use the existing code if available
          if (selectedRegion.code) {
            regionData.code = selectedRegion.code;
          }

          console.log(
            `Updating ${type} with ID:`,
            regionId,
            "Data:",
            regionData
          );
          response = await updateAction(regionId, regionData);
          console.log(`Update ${type} response:`, response);
        } else {
          // Create
          const createAction = apiActions[type].create;
          console.log(`Creating ${type} with data:`, regionData);
          response = await createAction(regionData);
          console.log(`Create ${type} response:`, response);
        }
      }

      // Check if response indicates success
      if (response && response.success) {
        // Invalidate cache to ensure fresh data on next query
        await invalidateCache();

        // Notify parent component that data has changed
        if (onDataChange) {
          onDataChange();
        }

        // Show a success toast with the API message if available
        if (type === "countries" && !selectedRegion && response.data) {
          // For newly created countries, show the auto-generated code
          addToast({
            title: "ایجاد موفقیت‌آمیز",
            description: `${formData.name} با موفقیت اضافه شد. (کد: ${response.data.code})`,
            color: "success",
            icon: <FaCheck />,
          });
        } else {
          addToast({
            title: selectedRegion ? "ویرایش موفقیت‌آمیز" : "ایجاد موفقیت‌آمیز",
            description:
              response.message ||
              `${formData.name} با موفقیت ${
                selectedRegion ? "ویرایش" : "اضافه"
              } شد`,
            color: "success",
            icon: <FaCheck />,
          });
        }

        // Close the modal after successful save
        onFormModalClose();
        setSelectedRegion(null);

        // If we have API response data, use it to update our local state
        if (response.data) {
          try {
            const apiData = response.data;

            // Generate a unique numeric ID from the API string ID if needed
            // Combine timestamp with hash of ID for uniqueness
            const timestamp = Date.now();
            let numericId: number;

            if (apiData._id) {
              // Try to parse as integer first
              const parsedId = parseInt(apiData._id);
              if (!isNaN(parsedId)) {
                numericId = parsedId;
              } else {
                // Create a hash and combine with timestamp to ensure uniqueness
                const hash = Math.abs(
                  apiData._id.split("").reduce((a: number, b: string) => {
                    a = (a << 5) - a + b.charCodeAt(0);
                    return a & a;
                  }, 0)
                );
                numericId = timestamp + hash;
              }
            } else {
              // No _id provided, create a fully random ID
              numericId = timestamp + Math.floor(Math.random() * 10000);
            }

            if (selectedRegion) {
              // Update existing region
              setRegions((prev) =>
                prev.map((region) =>
                  region.id === selectedRegion.id
                    ? {
                        ...region,
                        name: apiData.name || formData.name,
                        slug: apiData.slug || formData.slug,
                        originalId: apiData._id || region.originalId,
                        ...(type === "countries" && {
                          enName: apiData.enName || formData.enName,
                          code: apiData.code || formData.code,
                          phoneCode: apiData.phoneCode || formData.phoneCode,
                        }),
                        ...(formData.parentId && type !== "countries"
                          ? {
                              parent: {
                                id: getParentId(formData.parentId),
                                name: getParentName(formData.parentId),
                                originalId: formData.parentId,
                              },
                            }
                          : {}),
                      }
                    : region
                )
              );
            } else {
              // Add new region based on API response
              const newRegion: Region = {
                id: numericId,
                name: apiData.name || formData.name,
                slug: apiData.slug || formData.slug,
                originalId: apiData._id,
              };

              if (type === "countries") {
                newRegion.enName = apiData.enName || formData.enName;
                newRegion.code = apiData.code || formData.code;
                newRegion.phoneCode = apiData.phoneCode || formData.phoneCode;
              }

              if (formData.parentId && type !== "countries") {
                const parentId = getParentId(formData.parentId);
                const parentName = getParentName(formData.parentId);
                newRegion.parent = {
                  id: parentId,
                  name: parentName,
                  originalId: formData.parentId,
                };
              }

              setRegions((prev) => [...prev, newRegion]);
            }
          } catch (error) {
            console.error("Error processing API data for UI update:", error);
            // If we can't parse the API data, fall back to the form data for UI update
            updateUIFromForm();
          }
        } else {
          // If no API data provided, update UI from the form data
          updateUIFromForm();
        }

        // Close modal and reset form
        onFormModalClose();
        setSelectedRegion(null);
        setFormData({
          name: "",
          slug: "",
          parentId: "",
          enName: "",
          code: "",
          phoneCode: "",
        });
      } else {
        // If response indicates failure or is undefined
        let errorMessage = "ذخیره اطلاعات با مشکل مواجه شد";

        if (response) {
          errorMessage = response.message || errorMessage;
          console.error("API error response:", response);
        }

        addToast({
          title: "خطا",
          description: errorMessage,
          color: "danger",
          icon: <FaExclamationTriangle />,
        });
      }
    } catch (error) {
      console.error("Save error:", error);

      let errorMessage = "ذخیره اطلاعات با مشکل مواجه شد";

      if (error && typeof error === "object") {
        if ("message" in error) {
          errorMessage = (error as any).message || errorMessage;
        } else if (
          "response" in error &&
          (error as any).response &&
          "data" in (error as any).response
        ) {
          errorMessage = (error as any).response.data.message || errorMessage;
        }
      }

      addToast({
        title: "خطا",
        description: errorMessage,
        color: "danger",
        icon: <FaExclamationTriangle />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to get parent ID from originalId
  const getParentId = (originalId: string): number => {
    try {
      // Try to find the parent with matching originalId first
      const parent = parentRegions.find(
        (item) => item.originalId === originalId
      );
      if (parent) {
        return parent.id;
      }

      // Fallback to parsing the ID as a number
      const parsedId = parseInt(originalId);
      if (!isNaN(parsedId)) {
        return parsedId;
      }

      // If all else fails, create a hash from the string
      return Math.abs(
        originalId.split("").reduce((a, b, i) => {
          a = (a << 5) - a + b.charCodeAt(0) * (i + 1);
          return a & a;
        }, 0)
      );
    } catch (error) {
      console.error("Error getting parent ID:", error);
      return 0;
    }
  };

  // Helper function to update UI from form data when API data is not available
  const updateUIFromForm = () => {
    if (selectedRegion) {
      // Update existing item
      setRegions((prev) =>
        prev.map((item) => {
          if (item.id === selectedRegion.id) {
            const updatedRegion: Region = {
              ...item,
              name: formData.name,
              slug: formData.slug,
            };

            // For countries, add additional fields
            if (type === "countries") {
              updatedRegion.enName = formData.enName;
              updatedRegion.code = formData.code;
              updatedRegion.phoneCode = formData.phoneCode;
            }

            // Update parent if it changed
            if (formData.parentId && type !== "countries") {
              const parentId = getParentId(formData.parentId);
              const parentName = getParentName(formData.parentId);
              updatedRegion.parent = {
                id: parentId,
                name: parentName,
                originalId: formData.parentId,
              };
            }

            return updatedRegion;
          }
          return item;
        })
      );
    } else {
      // Add new item
      // Generate unique id for the new region - combine timestamp with random for uniqueness
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 10000);
      const newId = timestamp + random;

      // Create new region object
      const newRegion: Region = {
        id: newId,
        name: formData.name,
        slug: formData.slug,
      };

      // For countries, add additional fields
      if (type === "countries") {
        newRegion.enName = formData.enName;
        newRegion.code = formData.code;
        newRegion.phoneCode = formData.phoneCode;
      }

      // Add parent if it exists
      if (formData.parentId && type !== "countries") {
        const parentId = getParentId(formData.parentId);
        const parentName = getParentName(formData.parentId);
        newRegion.parent = {
          id: parentId,
          name: parentName,
          originalId: formData.parentId,
        };
      }

      // Add the new item to our state
      setRegions((prev) => [...prev, newRegion]);
    }
  };

  const getParentName = (id: string): string => {
    try {
      // Try finding by originalId first
      const parent = parentRegions.find((item) => item.originalId === id);
      if (parent) {
        return parent.name;
      }

      // Fallback to numeric ID
      const numericId = parseInt(id);
      if (!isNaN(numericId)) {
        const parentByNumericId = parentRegions.find(
          (item) => item.id === numericId
        );
        if (parentByNumericId) {
          return parentByNumericId.name;
        }
      }

      return "";
    } catch (error) {
      console.error("Error getting parent name:", error);
      return "";
    }
  };

  const getTypeTitle = () => {
    switch (type) {
      case "countries":
        return "کشور";
      case "provinces":
        return "استان";
      case "cities":
        return "شهر";
      case "areas":
        return "محله";
      default:
        return "";
    }
  };

  // For cache invalidation after operations
  const invalidateCache = async () => {
    try {
      console.log(`Invalidating cache for ${type}...`);
      // First, invalidate the appropriate React Query cache
      switch (type) {
        case "countries":
          await queryClient.invalidateQueries({
            queryKey: ["admin-countries"],
          });
          // Also attempt a forced refresh
          await getAdminCountries({ page: 1, limit: 100, forceRefresh: true });
          break;
        case "provinces":
          await queryClient.invalidateQueries({
            queryKey: ["admin-provinces"],
          });
          // Also attempt a forced refresh
          await getAdminProvinces({ page: 1, limit: 100, forceRefresh: true });
          break;
        case "cities":
          await queryClient.invalidateQueries({ queryKey: ["admin-cities"] });
          // Also attempt a forced refresh
          await getAdminCities({ page: 1, limit: 100, forceRefresh: true });
          break;
        case "areas":
          await queryClient.invalidateQueries({ queryKey: ["admin-areas"] });
          // Also attempt a forced refresh
          await getAdminAreas({ page: 1, limit: 100, forceRefresh: true });
          break;
      }

      // Force a refresh of the current data
      console.log(`Forcing refetch of ${type}...`);
      queryClient.refetchQueries({
        queryKey: [
          type === "countries"
            ? "admin-countries"
            : type === "provinces"
            ? "admin-provinces"
            : type === "cities"
            ? "admin-cities"
            : "admin-areas",
        ],
      });
    } catch (error) {
      console.error("Failed to invalidate cache:", error);
    }
  };

  // Get empty state message by type
  const getEmptyStateMessage = () => {
    switch (type) {
      case "countries":
        return {
          icon: <FaGlobe className="mx-auto text-4xl text-blue-200" />,
          title: "هیچ کشوری یافت نشد",
          description:
            "می‌توانید کشورهای جدید را با کلیک بر روی دکمه «افزودن کشور جدید» اضافه کنید",
        };
      case "provinces":
        return {
          icon: <FaMapMarkedAlt className="mx-auto text-4xl text-green-200" />,
          title: "هیچ استانی یافت نشد",
          description:
            "ابتدا یک کشور انتخاب کرده و سپس استان‌های آن را اضافه کنید",
        };
      case "cities":
        return {
          icon: <FaCity className="mx-auto text-4xl text-purple-200" />,
          title: "هیچ شهری یافت نشد",
          description:
            "ابتدا یک استان انتخاب کرده و سپس شهرهای آن را اضافه کنید",
        };
      case "areas":
        return {
          icon: <FaMapPin className="mx-auto text-4xl text-red-200" />,
          title: "هیچ محله‌ای یافت نشد",
          description:
            "ابتدا یک شهر انتخاب کرده و سپس محله‌های آن را اضافه کنید",
        };
      default:
        return {
          icon: (
            <FaExclamationTriangle className="mx-auto text-4xl text-yellow-200" />
          ),
          title: "اطلاعاتی یافت نشد",
          description: "هیچ اطلاعاتی برای نمایش وجود ندارد",
        };
    }
  };

  return (
    <div className="space-y-4">
      <RegionSearchBar
        search={search}
        onSearchChange={setSearch}
        onAdd={() => handleAddEdit()}
        typeTitle={getTypeTitle()}
      />
      <RegionsTable
        regions={filteredRegions}
        type={type}
        isLoading={isLoading}
        handleEdit={handleAddEdit}
        handleDelete={handleDeleteClick}
      />
      <RegionFormModal
        isOpen={isFormModalOpen}
        onClose={onFormModalClose}
        onSave={handleSave}
        formData={formData}
        onInputChange={handleInputChange}
        type={type}
        typeTitle={getTypeTitle()}
        parentRegions={parentRegions}
        selectedRegion={selectedRegion}
        isLoading={isSubmitting}
      />
      <DeleteRegionModal
        isOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
        onConfirm={confirmDelete}
        regionToDelete={regionToDelete}
        isLoading={isSubmitting}
      />
    </div>
  );
}
