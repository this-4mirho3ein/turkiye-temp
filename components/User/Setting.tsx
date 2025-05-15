"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  FiEdit2,
  FiCheck,
  FiX,
  FiUser,
  FiPhone,
  FiMail,
  FiCreditCard,
  FiCalendar,
  FiSave,
  FiCamera,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";
import { Card, Input, Button, Spinner } from "@heroui/react";
import { getUser, updateUser } from "@/controllers/makeRequest";
import { useAuth } from "@/context/AuthContext";
import mainConfig from "@/configs/mainConfig";

type UserData = {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  profileImage: string;
  phoneNumber: string;
  gender: "male" | "female" | "";
  countryCode: string;
};

export default function Setting() {
  // Add a very visible console log that should appear when component loads
  console.log(
    "%c SETTING COMPONENT LOADED ",
    "background: #ff0000; color: #ffffff; font-size: 20px; font-weight: bold;"
  );
  console.log("=".repeat(50));

  const [userData, setUserData] = useState<UserData>({
    id: "",
    firstName: "",
    lastName: "",
    birthDate: "",
    email: "",
    profileImage: "",
    phoneNumber: "",
    gender: "",
    countryCode: "",
  });

  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "success" | "error"
  >("idle");
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { state: authState } = useAuth();
  const [errors, setErrors] = useState<{
    id?: string;
    email?: string;
  }>({});

  // Use useCallback for fetchUserData to handle dependencies properly
  const fetchUserData = useCallback(async () => {
    try {
      if (!authState.accessToken) {
        console.error("No access token available for fetching user data");
        setLoading(false);
        return;
      }

      console.log(
        "Fetching user data with token:",
        authState.accessToken.substring(0, 10) +
          "..." +
          authState.accessToken.substring(authState.accessToken.length - 10)
      );

      // Get user data from API
      const response = await getUser(authState.accessToken);
      console.log("Raw API response:", JSON.stringify(response, null, 2));

      // The response is structured as { ...response.data, status: response.status }
      if (response && response.status === 200) {
        console.log("User data successfully fetched");

        // Check if we have the expected fields
        if (!response.id) console.warn("Missing id in response");
        if (!response.name) console.warn("Missing name in response");
        if (!response.family) console.warn("Missing family in response");

        // Set userData with values from response
        const updatedUserData = {
          id: response.id || "",
          firstName: response.name || "",
          lastName: response.family || "",
          birthDate: response.birthday || "",
          email: response.email || "",
          profileImage: response.profile_image
            ? `${mainConfig.apiServer}${response.profile_image}`
            : "",
          phoneNumber: response.mobile_number || "",
          gender: response.gender || "",
          countryCode: response.country_code || "",
        };

        console.log(
          "Setting userData to:",
          JSON.stringify(updatedUserData, null, 2)
        );
        setUserData(updatedUserData);

        console.log("Profile image path:", response.profile_image);
      } else {
        console.error(
          "Invalid response or error status:",
          JSON.stringify(response, null, 2)
        );
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  }, [authState.accessToken]);

  useEffect(() => {
    if (authState.accessToken) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [authState.accessToken, fetchUserData]);

  const handleChange = (field: keyof UserData, value: string) => {
    setUserData((prev) => ({ ...prev, [field]: value }));

    // Clear validation errors when user makes changes
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleProfileImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log("Selected profile image:", file.name, file.type, file.size);

      setProfileImageFile(file);

      // Create a temporary URL for preview
      const tempUrl = URL.createObjectURL(file);
      console.log("Created temporary URL for preview:", tempUrl);

      setUserData((prev) => ({ ...prev, profileImage: tempUrl }));
    }
  };

  const validateForm = () => {
    const newErrors: { id?: string; email?: string } = {};

    // Validate National Code (should be 10 digits)
    if (userData.id && !/^\d{10}$/.test(userData.id)) {
      newErrors.id = "کد ملی باید ۱۰ رقم باشد";
    }

    // Validate Email
    if (userData.email && !/\S+@\S+\.\S+/.test(userData.email)) {
      newErrors.email = "لطفا یک ایمیل معتبر وارد کنید";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    try {
      // Validate form before submitting
      if (!validateForm()) {
        setSaveStatus("error");
        return;
      }

      setSaveStatus("saving");

      // Create FormData to send files
      const formData = new FormData();

      // Add only the fields that can be updated through the user profile
      if (profileImageFile) {
        formData.append("profile_image", profileImageFile);
      }
      formData.append("gender", userData.gender);
      formData.append("birthday", userData.birthDate);

      // Debug: log form data entries
      console.log("FormData entries:");
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      console.log("Authorization token exists:", !!authState.accessToken);

      // Send the data to the server
      const response = await updateUser(authState.accessToken, formData);

      console.log("Update API response:", response);

      if (response.status === 200) {
        setProfileImageFile(null);
        setSaveStatus("success");

        // Refetch user data to update the UI with the latest info
        await fetchUserData();

        setTimeout(() => {
          setSaveStatus("idle");
        }, 3000);
      } else {
        console.error(
          "API returned non-200 status:",
          response.status,
          response.message
        );
        throw new Error(response.message || "Error updating profile");
      }
    } catch (error) {
      console.error("Error in handleSave:", error);
      setSaveStatus("error");
    }
  };

  if (loading) {
    return (
      <div className="col-span-12 lg:col-span-9">
        <Card className="rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-center h-64">
            <Spinner size="lg" color="primary" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="col-span-12 lg:col-span-9">
      {/* Console Test Component */}
      <Card className="rounded-xl p-6 border border-gray-100 mb-8">
        {/* Identity Banner */}
        <div className="bg-blue-50 p-4 rounded-lg mb-6 flex flex-col sm:flex-row justify-between items-center">
          <div className="text-center sm:text-right mb-4 sm:mb-0">
            <h3 className="text-lg font-semibold text-blue-800">
              {userData.firstName && userData.lastName
                ? userData.firstName + " " + userData.lastName
                : "کاربر"}
            </h3>
            <p className="text-blue-600 text-sm">
              حساب کاربری شما با این شماره تلفن احراز هویت می‌شود
              <span className="block text-xs text-blue-500 mt-1">
                (شماره تلفن قابل تغییر از این قسمت نیست)
              </span>
            </p>
          </div>
          <div className="flex items-center">
            <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              {userData.phoneNumber}
            </div>
            <FiPhone className="text-blue-600 mr-2" />
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center mb-8">
          <div className="mb-6 md:mb-0 md:ml-6 relative">
            <div
              className="relative group cursor-pointer"
              onClick={handleProfileImageClick}
            >
              <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-gray-200">
                {userData.profileImage ? (
                  <img
                    src={userData.profileImage}
                    alt="Profile"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      console.error(
                        "Error loading image:",
                        userData.profileImage
                      );
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = ""; // Clear the src
                      // Update state to remove the invalid image URL
                      setUserData((prev) => ({ ...prev, profileImage: "" }));
                    }}
                  />
                ) : (
                  <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                    <FiUser size={40} className="text-gray-400" />
                  </div>
                )}
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <FiCamera className="text-white text-xl" />
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleProfileImageChange}
              accept="image/*"
              className="hidden"
            />
          </div>
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              تنظیمات پروفایل
            </h2>
            <p className="text-gray-500 text-sm md:text-base mb-4">
              اطلاعات حساب کاربری خود را مشاهده و ویرایش کنید
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 text-right mb-1">
                نام
              </label>
              <div className="flex justify-between items-center bg-gray-50 rounded-lg px-4 py-3">
                <span className="text-gray-800">
                  {userData.firstName || "---"}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 text-right mb-1">
                نام خانوادگی
              </label>
              <div className="flex justify-between items-center bg-gray-50 rounded-lg px-4 py-3">
                <span className="text-gray-800">
                  {userData.lastName || "---"}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 text-right mb-1">
                شناسه کاربری
              </label>
              <div className="flex justify-between items-center bg-gray-50 rounded-lg px-4 py-3">
                <span className="text-gray-800 text-sm overflow-auto">
                  {userData.id || "---"}
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 text-right mb-1">
              جنسیت
            </label>
            <div className="flex justify-start   space-x-4 space-x-reverse">
              <div className="flex items-center">
                <input
                  id="male"
                  type="radio"
                  name="gender"
                  value="male"
                  checked={userData.gender === "male"}
                  onChange={() => handleChange("gender", "male")}
                  className="ml-2 h-4 w-4 text-primary focus:ring-primary"
                />
                <label htmlFor="male" className="text-gray-700">
                  مرد
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="female"
                  type="radio"
                  name="gender"
                  value="female"
                  checked={userData.gender === "female"}
                  onChange={() => handleChange("gender", "female")}
                  className="ml-2 h-4 w-4 text-primary focus:ring-primary"
                />
                <label htmlFor="female" className="text-gray-700">
                  زن
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 text-right mb-1">
              ایمیل
            </label>
            <div className="flex justify-between items-center bg-gray-50 rounded-lg px-4 py-3">
              <span className="text-gray-800">{userData.email || "---"}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 text-right mb-1">
              تاریخ تولد
            </label>
            <Input
              type="text"
              value={userData.birthDate}
              onChange={(e) => handleChange("birthDate", e.target.value)}
              placeholder="مثال: 1373/05/29"
              className="w-full text-right"
            />
            <span className="text-xs text-gray-500 block text-right mt-1">
              لطفا تاریخ تولد را به فرمت شمسی وارد کنید (مثال: 1373/05/29)
            </span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 text-right mb-1">
              شماره تلفن
            </label>
            <div className="flex justify-between items-center bg-gray-50 rounded-lg px-4 py-3">
              <span className="text-gray-800">
                {userData.phoneNumber || "---"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button
            onClick={handleSave}
            isLoading={saveStatus === "saving"}
            color="primary"
            startContent={saveStatus !== "saving" ? <FiSave /> : null}
            className="bg-primary/80"
          >
            {saveStatus === "saving" ? "در حال ذخیره..." : "ذخیره تغییرات"}
          </Button>
        </div>

        {saveStatus === "success" && (
          <div className="mt-4 p-3 bg-green-50 text-green-600 rounded-lg flex items-center">
            <FiCheckCircle className="w-5 h-5 mr-2" />
            تغییرات با موفقیت ذخیره شد
          </div>
        )}
        {saveStatus === "error" && (
          <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center">
            <FiAlertCircle className="w-5 h-5 mr-2" />
            خطا در ذخیره تغییرات
          </div>
        )}
      </Card>
    </div>
  );
}
