"use client";

import { FormData } from "../PostAdForm";
import { Select, Input, Button, SelectItem } from "@heroui/react";
import { useApi } from "@/hooks/useApi";
import CKEditorWrapper from "@/components/CkEditor";
import { properties } from "@/utils/datas";
import {
  getCategories,
  createAdvertisementStep1,
} from "@/controllers/makeRequest";
import { Category } from "@/types/interfaces";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import joiMessages from "@/utils/joiMessages";
import Joi from "joi";
// Define types for our form objects

const transactionTypes = [
  { value: "فروش", slug: "sale" },
  { value: "اجاره", slug: "rent" },
] as const;

const fetchers = { categories: getCategories };

type Props = {
  formData: FormData;
  updateField: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
  next: () => void;
};

// Add this utility function at the top of the file
const formatNumber = (num: string) => {
  // Remove any non-digit characters
  const cleanNum = num.replace(/[^\d]/g, "");
  // Format with commas
  return cleanNum.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const unformatNumber = (str: string) => {
  // Remove any non-digit characters
  return str.replace(/[^\d]/g, "");
};

export default function StepOne({ formData, updateField, next }: Props) {
  const { data: categoriesData, isLoading: isCategoriesLoading } = useApi(
    "categories",
    fetchers,
    formData.propertyType?.slug,
    !!(formData.dealType?.slug && formData.propertyType?.slug)
  );

  // Get the appropriate categories based on the selected deal type
  const availableCategories = formData.dealType?.slug
    ? categoriesData?.[formData.dealType.slug]?.subgroup || []
    : [];

  // Reset category when dealType or propertyType changes
  useEffect(() => {
    updateField("category", { value: "", slug: "" });
  }, [formData.dealType?.slug, formData.propertyType?.slug]);

  // Add this handler for price changes
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = unformatNumber(e.target.value);
    updateField("price", numericValue); // Store clean number in state
  };
  const token = useAuth();
  // Format the display value
  const displayPrice = formData.price ? formatNumber(formData.price) : "";

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const stepOneSchema = Joi.object({
    dealType: Joi.string().required().messages(joiMessages("dealType")),
    propertyType: Joi.string().required().messages(joiMessages("propertyType")),
    category: Joi.string().required().messages(joiMessages("category")), // Uncomment if needed
    title: Joi.string()
      .min(5)
      .max(100)
      .required()
      .messages(joiMessages("title")),
    description: Joi.string()
      .min(10)
      .max(1000)
      .required()
      .messages(joiMessages("description")),
    price: Joi.number().min(0).required().messages(joiMessages("price")),
  });
  const handleNext = async () => {
    setError(null);
   
    // Only send the required fields
    const payload = {
      dealType: formData.dealType.slug,
      propertyType: formData.propertyType.slug,
      category: formData.category.slug,
      title: formData.title,
      description: formData.description,
      price: formData.price,
    };
    const { error } = stepOneSchema.validate(payload, { abortEarly: false });
    if (error) {
      setError(error.details[0].message);
      return;
    }
    try {
      setLoading(true);
      const res = await createAdvertisementStep1(
        payload,
        token.state.accessToken
      );
      if (res.status >= 200 && res.status < 300) {
        if (res.elan_id) {
          updateField("id", res.elan_id);
        }
        next();
      } else {
        setError(res.message || "خطا در ثبت اطلاعات. لطفا دوباره تلاش کنید.");
      }
    } catch (e: any) {
      setError(e.message || "خطا در ثبت اطلاعات. لطفا دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-2 py-4 my-4 rounded-lg  border border-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-right text-indigo-700">
        ثبت ملک جدید
      </h1>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Transaction Type Select */}
          <div>
            <label className="block text-sm font-medium mb-2 text-right text-gray-700">
              نوع معامله
            </label>
            <Select
              selectedKeys={[formData.dealType?.slug || ""]}
              onChange={(e) => {
                const selected = transactionTypes.find(
                  (t) => t.slug === e.target.value
                );
                if (selected) {
                  updateField("dealType", {
                    value: selected.value,
                    slug: selected.slug,
                  });
                }
              }}
              className="text-right"
            >
              {transactionTypes.map((type) => (
                <SelectItem key={type.slug}>{type.value}</SelectItem>
              ))}
            </Select>
          </div>

          {/* Property Type Select */}
          <div>
            <label className="block text-sm font-medium mb-2 text-right text-gray-700">
              کاربری
            </label>
            <Select
              selectedKeys={[formData.propertyType?.slug || ""]}
              onChange={(e) => {
                const selected = properties.find(
                  (p) => p.slug === e.target.value
                );
                if (selected) {
                  updateField("propertyType", {
                    value: selected.title,
                    slug: selected.slug,
                  });
                }
              }}
              className="text-right"
              required
            >
              {properties.map((prop) => (
                <SelectItem key={prop.slug}>{prop.title}</SelectItem>
              ))}
            </Select>
          </div>
        </div>

        {/* Category Select */}
        <div>
          <label className="block text-sm font-medium mb-2 text-right text-gray-700">
            دسته‌بندی
          </label>
          <Select
            selectedKeys={[formData.category?.slug || ""]}
            onChange={(e) => {
              const selected = availableCategories.find(
                (c: Category) => c.slug === e.target.value
              );
              if (selected) {
                updateField("category", {
                  value: selected.title,
                  slug: selected.slug,
                });
              }
            }}
            className="text-right"
            isDisabled={
              !formData.dealType?.slug ||
              !formData.propertyType?.slug ||
              isCategoriesLoading
            }
            required
          >
            {availableCategories.map((cat: Category) => (
              <SelectItem key={cat.slug}>{cat.title}</SelectItem>
            ))}
          </Select>
        </div>

        {/* Title Input */}
        <div>
          <label className="block text-sm font-medium mb-2 text-right text-gray-700">
            عنوان آگهی
          </label>
          <Input
            value={formData.title}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder="عنوان ملک خود را وارد کنید"
            required
            className="text-right placeholder:text-right"
          />
        </div>

        {/* Description */}
        <div className="relative w-full max-w-3xl mx-auto">
          <label
            className="block text-sm font-medium mb-2 text-right text-gray-700"
            dir="rtl"
          >
            توضیحات
          </label>
          <div
            className="relative w-full"
            style={{
              maxWidth: "100%",
              overflow: "hidden",
            }}
          >
            <CKEditorWrapper
              data={formData.description}
              onChange={updateField}
            />
          </div>
        </div>

        {/* Price Input */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <label className="block text-sm font-medium mb-2 text-right text-gray-700">
              قیمت
            </label>
            <Input
              type="text"
              value={displayPrice}
              onChange={handlePriceChange}
              placeholder="قیمت را وارد کنید"
              variant="bordered"
              radius="sm"
              classNames={{
                base: "w-full",
                mainWrapper: "h-full",
                input: ["text-right pr-3 pl-16", "appearance-none"].join(" "),
                innerWrapper: "h-full",
              }}
              endContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-gray-500">تومان</span>
                </div>
              }
            />
          </div>
        </div>

        <Button
          type="button"
          variant="solid"
          color="primary"
          className="w-full mt-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition duration-200"
          onPress={handleNext}
          isLoading={loading}
        >
          ادامه
        </Button>
        {error && (
          <div className="mt-4 text-red-600 text-center font-bold">{error}</div>
        )}
      </form>

      {/* Debug Information */}
      {/* <div
        dir="ltr"
        className="mt-8 p-4 bg-gray-100 rounded-lg text-left text-sm font-mono max-w-7xl"
      >
        <h3 className="font-bold mb-2">Debug Info:</h3>
        <div className="flex gap-4">
          <div className="flex-1">
            <h4 className="font-bold text-blue-600 mb-2">Form Data:</h4>
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(formData, null, 2)}
            </pre>
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-green-600 mb-2">API Data:</h4>
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(
                {
                  categoriesData,
                  availableCategories,
                  isLoading: isCategoriesLoading,
                },
                null,
                2
              )}
            </pre>
          </div>
        </div>
      </div> */}
    </div>
  );
}
