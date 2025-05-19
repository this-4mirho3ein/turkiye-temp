"use client";

import { useState, useEffect } from "react";
import {
  FaCheck,
  FaTimes,
  FaCalendarAlt,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaIdCard,
  FaVenusMars,
  FaBirthdayCake,
  FaUserShield,
} from "react-icons/fa";
import Input from "@/components/admin/ui/Input";
import Button from "@/components/admin/ui/Button";
import { ModalBody, ModalFooter, Divider, addToast } from "@heroui/react";
import { User, UserRole } from "../data/users";
import { getRoleGroups } from "../data/actions";
import { roleGroupsWithIcons } from "../data/roles-client";
import { updateAdminUser } from "@/controllers/makeRequest";
import { motion } from "framer-motion";

interface UserEditFormProps {
  user: User | null;
  onSave: (user: User) => void;
  onCancel: () => void;
}

interface ExtendedFormData extends Omit<User, "id" | "createdAt"> {
  firstName: string;
  lastName: string;
  countryCode: string;
  nationalCode: string;
  gender: string;
  birthDate: string;
  isActive: boolean;
  isBanned: boolean;
}

const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
    },
  },
};

export default function UserEditForm({
  user,
  onSave,
  onCancel,
}: UserEditFormProps) {
  const [formData, setFormData] = useState<ExtendedFormData>({
    name: "",
    email: "",
    phone: "",
    role: "normal",
    status: "active",
    firstName: "",
    lastName: "",
    countryCode: "+98",
    nationalCode: "",
    gender: "male",
    birthDate: "",
    isActive: true,
    isBanned: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverRoleGroups, setServerRoleGroups] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Load role groups data from server action (for role names and descriptions)
  useEffect(() => {
    const loadRoleGroups = async () => {
      try {
        const data = await getRoleGroups();
        setServerRoleGroups(data);
      } catch (error) {
        console.error("Error loading role groups:", error);
      }
    };

    loadRoleGroups();
  }, []);

  useEffect(() => {
    if (user) {
      console.log("Initializing form with user:", user);

      // Parse name into firstName and lastName
      const nameParts = user.name.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        status: user.status,
        lastLogin: user.lastLogin,
        firstName,
        lastName,
        countryCode: "+98", // Default country code
        nationalCode: "",
        gender: "male",
        birthDate: "",
        isActive: user.status === "active",
        isBanned: user.status === "banned",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        role: "normal",
        status: "active",
        firstName: "",
        lastName: "",
        countryCode: "+98",
        nationalCode: "",
        gender: "male",
        birthDate: "",
        isActive: true,
        isBanned: false,
      });
    }
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Update name if firstName or lastName changes
    if (name === "firstName" || name === "lastName") {
      const firstName = name === "firstName" ? value : formData.firstName;
      const lastName = name === "lastName" ? value : formData.lastName;

      setFormData((prev) => ({
        ...prev,
        [name]: value,
        name: `${firstName} ${lastName}`.trim(),
      }));
    }
    // Update status based on isActive and isBanned
    else if (name === "isActive") {
      const isActive = value === "true";
      setFormData((prev) => ({
        ...prev,
        isActive,
        status: isActive ? (prev.isBanned ? "banned" : "active") : "inactive",
      }));
    } else if (name === "isBanned") {
      const isBanned = value === "true";
      setFormData((prev) => ({
        ...prev,
        isBanned,
        status: isBanned ? "banned" : prev.isActive ? "active" : "inactive",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "نام الزامی است";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "نام خانوادگی الزامی است";
    }

    if (!formData.email.trim()) {
      newErrors.email = "ایمیل الزامی است";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "فرمت ایمیل صحیح نیست";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "شماره تلفن الزامی است";
    } else if (!/^09\d{9}$/.test(formData.phone)) {
      newErrors.phone = "فرمت شماره تلفن صحیح نیست (مثال: 09123456789)";
    }

    if (formData.nationalCode && !/^\d{10}$/.test(formData.nationalCode)) {
      newErrors.nationalCode = "کد ملی باید ۱۰ رقم باشد";
    }

    if (formData.birthDate) {
      // Check if birthDate is a valid date
      const date = new Date(formData.birthDate);
      if (isNaN(date.getTime())) {
        newErrors.birthDate = "تاریخ تولد نامعتبر است";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSaving(true);

    try {
      // For existing users, update via API
      if (user?.originalId) {
        // Prepare roles array based on user role
        const roles = ["customer"]; // All users have customer role
        if (formData.role !== "normal") {
          roles.push(formData.role); // Add additional role if not normal
        }

        // Ensure date is in YYYY-MM-DD format if present
        let birthDate = formData.birthDate || "";
        if (birthDate && !birthDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
          // Try to convert from any other format to YYYY-MM-DD
          try {
            const date = new Date(birthDate);
            if (!isNaN(date.getTime())) {
              birthDate = date.toISOString().split("T")[0]; // Get YYYY-MM-DD part
            }
          } catch (e) {
            console.error("Could not parse date:", birthDate);
            birthDate = ""; // Reset to empty if can't convert
          }
        }

        // Prepare API request data exactly as specified in the requirement
        const apiData = {
          userId: user.originalId,
          phone: formData.phone,
          countryCode: formData.countryCode,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          roles: roles,
          nationalCode: formData.nationalCode || "",
          gender: formData.gender || "male",
          birthDate: birthDate,
          isActive: formData.isActive,
          isBanned: formData.isBanned,
        };

        console.log(
          "Sending API request with data:",
          JSON.stringify(apiData, null, 2)
        );

        // Make API request - don't pass user.originalId as first parameter, it's already in the request body
        const response = await updateAdminUser("", apiData);

        if (response.success) {
          addToast({
            title: "موفقیت",
            description: "اطلاعات کاربر با موفقیت بروزرسانی شد",
            color: "success",
          });

          // Pass updated user to parent component
          onSave({
            ...formData,
            id: user.id,
            createdAt: user.createdAt,
          });
        } else {
          throw new Error(response.message || "خطا در بروزرسانی کاربر");
        }
      } else {
        // For new users or mock data, use the local update
        onSave({
          ...formData,
          id: user?.id || 0,
          createdAt: user?.createdAt || "",
        });
      }
    } catch (error) {
      console.error("Error updating user:", error);
      addToast({
        title: "خطا",
        description:
          error instanceof Error ? error.message : "خطا در بروزرسانی کاربر",
        color: "danger",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <ModalBody className="max-h-[80vh] overflow-y-auto p-0 rtl">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={formVariants}
          className="p-6"
        >
          <motion.div variants={itemVariants} className="mb-8">
            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto mb-4 bg-primary-50 rounded-full flex items-center justify-center">
                <FaUser className="text-primary w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {user ? `ویرایش کاربر: ${user.name}` : "افزودن کاربر جدید"}
              </h2>
              <p className="text-gray-500 text-sm">
                اطلاعات کاربر را در فرم زیر وارد کنید
              </p>
            </div>
          </motion.div>

          <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-100">
            <motion.h3
              variants={itemVariants}
              className="text-lg font-bold text-gray-700 mb-4 border-r-4 border-primary pr-2"
            >
              اطلاعات شخصی
            </motion.h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div variants={itemVariants}>
                <Input
                  name="firstName"
                  label="نام"
                  placeholder="نام کاربر را وارد کنید"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  error={errors.firstName}
                  required
                  startContent={<FaUser className="text-gray-400" />}
                  className="w-full"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <Input
                  name="lastName"
                  label="نام خانوادگی"
                  placeholder="نام خانوادگی کاربر را وارد کنید"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  error={errors.lastName}
                  required
                  startContent={<FaUser className="text-gray-400" />}
                  className="w-full"
                />
              </motion.div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-100">
            <motion.h3
              variants={itemVariants}
              className="text-lg font-bold text-gray-700 mb-4 border-r-4 border-primary pr-2"
            >
              اطلاعات تماس
            </motion.h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div variants={itemVariants}>
                <Input
                  name="email"
                  label="ایمیل"
                  placeholder="ایمیل کاربر را وارد کنید"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={errors.email}
                  required
                  startContent={<FaEnvelope className="text-gray-400" />}
                  className="w-full"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <Input
                  name="phone"
                  label="شماره تلفن"
                  placeholder="شماره تلفن کاربر را وارد کنید"
                  value={formData.phone}
                  onChange={handleInputChange}
                  error={errors.phone}
                  required
                  startContent={<FaPhone className="text-gray-400" />}
                  className="w-full"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <Input
                  name="nationalCode"
                  label="کد ملی"
                  placeholder="کد ملی کاربر را وارد کنید"
                  value={formData.nationalCode}
                  onChange={handleInputChange}
                  error={errors.nationalCode}
                  startContent={<FaIdCard className="text-gray-400" />}
                  className="w-full"
                />
              </motion.div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-100">
            <motion.h3
              variants={itemVariants}
              className="text-lg font-bold text-gray-700 mb-4 border-r-4 border-primary pr-2"
            >
              اطلاعات دسترسی
            </motion.h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نقش کاربر
                </label>
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  {/* Map through the role groups and display each role */}
                  {roleGroupsWithIcons.flatMap(group => 
                    group.roles.map(role => (
                      <div key={role.id} className="flex-1">
                        <label
                          className={`flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer border transition-all ${
                            formData.role === role.id
                              ? "border-primary bg-primary-50 shadow-sm"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="role"
                            value={role.id}
                            checked={formData.role === role.id}
                            onChange={handleInputChange}
                            className="sr-only"
                          />
                          <role.icon
                            className={`text-2xl mb-2 ${
                              formData.role === role.id
                                ? "text-primary"
                                : "text-gray-400"
                            }`}
                          />
                          <span
                            className={`text-sm font-medium ${
                              formData.role === role.id
                                ? "text-primary"
                                : "text-gray-600"
                            }`}
                          >
                            {role.name}
                          </span>
                        </label>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وضعیت کاربر
                </label>
                <div className="space-y-2">
                  <label className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={(e) =>
                        handleInputChange({
                          target: {
                            name: "isActive",
                            value: e.target.checked ? "true" : "false",
                          },
                        } as any)
                      }
                      className="ml-2 form-checkbox h-5 w-5 text-primary rounded-sm border-gray-300 focus:ring-0"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-700">فعال</div>
                      <p className="text-gray-500 text-xs">
                        کاربر می‌تواند وارد سیستم شود
                      </p>
                    </div>
                    {formData.isActive ? (
                      <div className="bg-green-100 text-green-800 text-xs rounded-full px-2 pt-0.5 pb-px">
                        فعال
                      </div>
                    ) : (
                      <div className="bg-gray-100 text-gray-800 text-xs rounded-full px-2 pt-0.5 pb-px">
                        غیرفعال
                      </div>
                    )}
                  </label>

                  <label className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isBanned"
                      checked={formData.isBanned}
                      onChange={(e) =>
                        handleInputChange({
                          target: {
                            name: "isBanned",
                            value: e.target.checked ? "true" : "false",
                          },
                        } as any)
                      }
                      className="ml-2 form-checkbox h-5 w-5 text-red-500 rounded-sm border-gray-300 focus:ring-0"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-700">مسدود شده</div>
                      <p className="text-gray-500 text-xs">
                        کاربر از استفاده از سیستم منع شده است
                      </p>
                    </div>
                    {formData.isBanned ? (
                      <div className="bg-red-100 text-red-800 text-xs rounded-full px-2 pt-0.5 pb-px">
                        مسدود
                      </div>
                    ) : (
                      <div className="bg-gray-100 text-gray-800 text-xs rounded-full px-2 pt-0.5 pb-px">
                        آزاد
                      </div>
                    )}
                  </label>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </ModalBody>

      <ModalFooter>
        <div className="flex flex-col md:flex-row gap-2 w-full rtl">
          <Button
            color="primary"
            variant="solid"
            onClick={handleSubmit}
            isLoading={isSaving}
            className="flex-1 order-2 md:order-1 py-2 bg-blue-500 hover:bg-blue-600 text-white gap-1.5"
          >
            <FaCheck /> {user ? "بروزرسانی اطلاعات" : "ثبت کاربر جدید"}
          </Button>

          <Button
            color="danger"
            variant="solid"
            onPress={onCancel}
            className="order-1 md:order-2 py-2 bg-red-500 hover:bg-red-600 text-white gap-1.5"
          >
            <FaTimes /> انصراف
          </Button>
        </div>
      </ModalFooter>
    </>
  );
}
