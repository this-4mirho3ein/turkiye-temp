"use client";
import { Button, Input, Card } from "@heroui/react";
import type { FormData } from "../PostAdForm";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { FaTrash, FaStar, FaUpload } from "react-icons/fa";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import mainConfig from "@/configs/mainConfig";

type Props = {
  formData: FormData;
  updateField: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
  back: () => void;
};

type ImagePreview = {
  file: File;
  url: string;
  isPrimary: boolean;
  id: string;
};

export default function StepFour({ formData, updateField, back }: Props) {
  const [previews, setPreviews] = useState<ImagePreview[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { state: authState } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const generateImageId = (file: File): string => {
    return `${file.name}-${file.size}-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 9)}`;
  };

  useEffect(() => {
    if (
      formData.images &&
      formData.images.length > 0 &&
      previews.length === 0
    ) {
      const initialPreviews = formData.images.map((file, index) => ({
        file,
        url: URL.createObjectURL(file),
        isPrimary: index === 0,
        id: generateImageId(file),
      }));
      setPreviews(initialPreviews);
    }

    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [formData.images, previews.length]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newPreviews: ImagePreview[] = [];
    const existingFiles = previews.map((preview) => preview.file);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const isDuplicate = existingFiles.some(
        (existingFile) =>
          existingFile.name === file.name && existingFile.size === file.size
      );
      if (isDuplicate) continue;

      newPreviews.push({
        file,
        url: URL.createObjectURL(file),
        isPrimary: existingFiles.length === 0 && newPreviews.length === 0,
        id: generateImageId(file),
      });
    }

    const updatedPreviews = [...previews, ...newPreviews];
    setPreviews(updatedPreviews);
    updateField(
      "images",
      updatedPreviews.map((preview) => preview.file)
    );

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedPreviews = [...previews];

    const urlToRevoke = updatedPreviews[index].url;

    const isRemovingPrimary = updatedPreviews[index].isPrimary;

    updatedPreviews.splice(index, 1);

    if (isRemovingPrimary && updatedPreviews.length > 0) {
      updatedPreviews[0].isPrimary = true;
    }

    setPreviews([...updatedPreviews]);

    updateField(
      "images",
      updatedPreviews.map((preview) => preview.file)
    );

    URL.revokeObjectURL(urlToRevoke);
  };

  const handleSetPrimary = (index: number) => {
    const updatedPreviews = previews.map((preview, i) => ({
      ...preview,
      isPrimary: i === index,
    }));

    setPreviews([...updatedPreviews]);

    updateField(
      "images",
      updatedPreviews.map((preview) => preview.file)
    );
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError(null);

    try {
      if (formData.images.length === 0) {
        setError("لطفا حداقل یک تصویر انتخاب کنید");
        return;
      }

      if (!formData.id) {
        setError("شناسه آگهی یافت نشد. لطفا از ابتدا شروع کنید");
        return;
      }

      const token = authState.accessToken;
      if (!token) {
        setError("لطفا مجددا وارد شوید");
        return;
      }

      const apiFormData = new FormData();

      let primaryIndex = 0;
      previews.forEach((preview, index) => {
        if (preview.isPrimary) {
          primaryIndex = index;
        }
      });

      apiFormData.append("primaryImageIndex", primaryIndex.toString());

      formData.images.forEach((file, index) => {
        apiFormData.append("images", file);
      });

      console.log("Sending images to backend...");
      console.log(`Total images: ${formData.images.length}`);
      console.log(`Primary image index: ${primaryIndex}`);

      const apiUrl = `${mainConfig.apiServer}/AdvertisementStep4APISimple/${formData.id}`;
      console.log("API URL:", apiUrl);

      const response = await axios.post(apiUrl, apiFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });

      console.log("API Response:", response.data);

      if (response.status >= 200 && response.status < 300) {
        alert("آگهی شما با موفقیت ثبت شد");

        if (response.data.id) {
          router.push(`/realestates/${response.data.id}`);
        } else {
          router.push("/user/profile");
        }
      } else {
        setError("خطا در ثبت آگهی. لطفا مجددا تلاش کنید");
      }
    } catch (error: any) {
      console.error("Error submitting ad:", error);
      setError(
        error.response?.data?.message ||
          "خطا در ارتباط با سرور. لطفا مجددا تلاش کنید"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg border border-gray-100 rtl space-y-6">
      <h1 className="text-2xl font-bold mb-6 text-right text-indigo-700">
        اطلاعات تماس و تصاویر
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-right">
          {error}
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3 text-right">تصاویر ملک</h2>
        <p className="text-sm text-gray-500 mb-4 text-right">
          تصاویر با کیفیت بالا باعث افزایش بازدید آگهی شما می‌شود. تصویر اول به
          عنوان تصویر اصلی نمایش داده می‌شود.
        </p>

        <div className="flex items-center justify-center w-full mb-4">
          <label
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            htmlFor="file-upload"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <FaUpload className="w-8 h-8 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">برای آپلود کلیک کنید</span> یا
                تصاویر را اینجا رها کنید
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                SVG، PNG، JPG یا GIF (حداکثر ۵ مگابایت)
              </p>
            </div>
            <input
              id="file-upload"
              ref={fileInputRef}
              type="file"
              className="hidden"
              multiple
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>
        </div>

        {previews.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {previews.map((preview, index) => (
              <div key={preview.id} className="relative group">
                <Card className="overflow-hidden">
                  <div className="relative h-40 w-full">
                    <Image
                      src={preview.url}
                      alt={`Preview ${index + 1}`}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="(max-width: 768px) 50vw, 33vw"
                      priority={index < 6}
                    />
                  </div>

                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSetPrimary(index)}
                        className={`p-2 rounded-full mx-2 ${
                          preview.isPrimary
                            ? "bg-yellow-500"
                            : "bg-gray-200 hover:bg-yellow-500"
                        } text-white transition-colors`}
                        title={
                          preview.isPrimary
                            ? "تصویر اصلی"
                            : "تنظیم به عنوان تصویر اصلی"
                        }
                        type="button"
                      >
                        <FaStar size={16} />
                      </button>
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="p-2 mx-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                        title="حذف تصویر"
                        type="button"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </div>

                  {preview.isPrimary && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                      اصلی
                    </div>
                  )}
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-between mt-8">
        <Button
          onPress={back}
          variant="bordered"
          className="text-gray-700 rounded border-gray-300 hover:bg-gray-50 px-6 py-2"
          isDisabled={isSubmitting}
        >
          بازگشت
        </Button>

        <Button
          onPress={handleSubmit}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          isLoading={isSubmitting}
          isDisabled={isSubmitting || formData.images.length === 0}
        >
          انتشار
        </Button>
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded-lg text-left text-xs font-mono overflow-auto max-h-60">
        <h3 className="font-bold mb-2">Debug Info:</h3>
        <pre className="whitespace-pre-wrap">
          {JSON.stringify(
            {
              id: formData.id,
              imageCount: formData.images.length,
              primaryIndex: previews.findIndex((p) => p.isPrimary),
              imageNames: formData.images.map((file) => file.name),
            },
            null,
            2
          )}
        </pre>
      </div>
    </div>
  );
}

