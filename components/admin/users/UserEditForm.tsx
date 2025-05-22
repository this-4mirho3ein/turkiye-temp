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
import moment from "jalali-moment";
import Input from "@/components/admin/ui/Input";
import Button from "@/components/admin/ui/Button";
import { ModalBody, ModalFooter, Divider, addToast } from "@heroui/react";
import { User, UserRole } from "../data/users";
import { getRoleGroups } from "../data/actions";
import { roleGroupsWithIcons } from "../data/roles-client";
import { updateAdminUser, getAdminUserById, createAdminUser } from "@/controllers/makeRequest";
import { motion } from "framer-motion";
import mainConfig from "@/configs/mainConfig";
import { z } from "zod";
// Persian date picker import
import PersianDatePicker from "@/components/admin/ui/calendar/PersianDatePicker";

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

const userFormSchema = z.object({
  firstName: z.string().min(2, { message: "نام باید حداقل ۲ حرف باشد" }),
  lastName: z.string().min(2, { message: "نام خانوادگی باید حداقل ۲ حرف باشد" }),
  email: z.string().email({ message: "فرمت ایمیل صحیح نیست" }),
  phone: z.string().regex(/^9\d{9}$/, { message: "فرمت شماره تلفن صحیح نیست (باید با 9 شروع شود و 10 رقم باشد)" }),
  nationalCode: z.string().regex(/^\d{10}$/, { message: "کد ملی باید ۱۰ رقم باشد" }).or(z.string().length(0)),
  gender: z.enum(["male", "female"]),
  birthDate: z.string().optional(),
  role: z.string(),
  countryCode: z.string(),
  isActive: z.boolean(),
  isBanned: z.boolean()
});

type UserFormSchema = z.infer<typeof userFormSchema>;

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
    avatar: "",
    lastLogin: "",
    originalId: "",
    isDeleted: false,
    displayMobile: false,
    displayEmail: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverRoleGroups, setServerRoleGroups] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

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
    const fetchUserData = async () => {
      if (user?.originalId) {
        setIsLoading(true);
        try {
          const response = await getAdminUserById(user.originalId);
          if (response && response.success && response.data) {
            const userData = response.data as any;
            console.log("Loaded user data from API:", userData);

            setFormData({
              name: user.name,
              email: userData.email || user.email,
              phone: userData.phone || user.phone,
              avatar: user.avatar,
              role: user.role,
              status: user.status,
              lastLogin: user.lastLogin,
              firstName: userData.firstName || "",
              lastName: userData.lastName || "",
              countryCode: userData.countryCode || "+98",
              nationalCode: userData.nationalCode || "",
              gender: userData.gender || "male",
              birthDate: userData.birthDate || "",
              isActive:
                userData.isActive !== undefined
                  ? userData.isActive
                  : user.status === "active",
              isBanned:
                userData.isBanned !== undefined
                  ? userData.isBanned
                  : user.status === "banned",
              originalId: user.originalId || "",
              isDeleted: false,
              displayMobile: false,
              displayEmail: false
            });
          } else {
            initializeFromLocalUser();
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
          initializeFromLocalUser();
        } finally {
          setIsLoading(false);
        }
      } else {
        initializeFromLocalUser();
      }
    };

    const initializeFromLocalUser = () => {
      if (user) {
        console.log("Initializing form with local user data:", user);

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
          countryCode: "+98", 
          nationalCode: "",
          gender: "male",
          birthDate: "",
          isActive: user.status === "active",
          isBanned: user.status === "banned",
          originalId: user.originalId || "",
          isDeleted: false,
          displayMobile: user.displayMobile || false,
          displayEmail: user.displayEmail || false
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
          avatar: "",
          lastLogin: "",
          originalId: "",
          isDeleted: false,
          displayMobile: false,
          displayEmail: false
        });
      }
    };

    fetchUserData();
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "firstName" || name === "lastName") {
      const firstName = name === "firstName" ? value : formData.firstName;
      const lastName = name === "lastName" ? value : formData.lastName;

      setFormData((prev) => ({
        ...prev,
        [name]: value,
        name: `${firstName} ${lastName}`.trim(),
      }));
    } else if (name === "phone") {
      // Remove leading zero from phone number if present
      let processedValue = value;
      if (value.startsWith('0')) {
        processedValue = value.substring(1);
      }
      
      setFormData((prev) => ({
        ...prev,
        [name]: processedValue,
      }));
      console.log('Phone number processed:', processedValue);
    } else if (name === "isActive") {
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

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    console.log('validateForm function called');
    const newErrors: Record<string, string> = {};
    
    try {
      console.log('Parsing form data with Zod schema');
      const formDataToValidate = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        nationalCode: formData.nationalCode,
        gender: formData.gender as "male" | "female",
        birthDate: formData.birthDate,
        role: formData.role,
        countryCode: formData.countryCode,
        isActive: formData.isActive,
        isBanned: formData.isBanned
      };
      
      console.log('Form data being validated:', formDataToValidate);
      userFormSchema.parse(formDataToValidate);
      
      console.log('Zod validation passed');
      setErrors({});
      return true;
    } catch (err) {
      console.log('Validation error caught:', err);
      
      if (err instanceof z.ZodError) {
        console.log('ZodError detected with errors:', err.errors);
        
        err.errors.forEach((error) => {
          const field = error.path[0] as string;
          newErrors[field] = error.message;
          console.log(`Validation error for field '${field}':`, error.message);
        });
      } else {
        console.error('Non-Zod validation error:', err);
        addToast({
          title: "خطا",
          description: "خطای غیرمنتظره در اعتبارسنجی فرم",
          color: "danger",
        });
      }
      
      console.log('Setting errors state with:', newErrors);
      setErrors(newErrors);
      
      const isValid = Object.keys(newErrors).length === 0;
      console.log('Form validation result after error handling:', isValid);
      return isValid;
    }
  };

  const handleSubmit = async () => {
    console.log('handleSubmit function called');
    
    // Check if form is valid
    console.log('Validating form...');
    const isValid = validateForm();
    console.log('Form validation result:', isValid);
    
    if (!isValid) {
      console.log('Form validation failed, returning early');
      return;
    }

    console.log('Setting isSaving to true');
    setIsSaving(true);

    try {
      const roles = ["customer"]; 
      if (formData.role !== "normal") {
        roles.push(formData.role); 
      }

      let birthDate = formData.birthDate || "";
      if (birthDate && !birthDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
        try {
          const date = moment(birthDate);
          if (date.isValid()) {
            birthDate = date.format('YYYY-MM-DD'); 
          }
        } catch (e) {
          console.error("Could not parse date:", birthDate);
          birthDate = ""; 
        }
      }

      if (user?.originalId) {
        // Update existing user
        const apiData = {
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
          "Sending update API request with data:",
          JSON.stringify(apiData, null, 2)
        );
        console.log("User ID being sent:", user.originalId);

        // Make sure we're passing a valid ID - if originalId is empty, try using the regular id
        const userId = user.originalId || String(user.id);
        console.log("Final user ID being used:", userId);

        console.log("Calling updateAdminUser with userId:", userId);
        console.log("API data being sent:", apiData);
        
        try {
          const response = await updateAdminUser(userId, apiData as any);
          console.log("Update API response:", response);

          if (response.success) {
            console.log("Update successful, calling onSave with data");
            onSave({
              ...formData,
              id: user.id,
              createdAt: user.createdAt,
            } as User);
            
            console.log("Showing success toast");
            addToast({
              title: "موفقیت",
              description: "اطلاعات کاربر با موفقیت به‌روزرسانی شد",
              color: "success",
            });
          } else {
            console.error("Update API returned success=false:", response.message);
            throw new Error(response.message || "خطا در بروزرسانی کاربر");
          }
        } catch (updateError) {
          console.error("Error in updateAdminUser call:", updateError);
          throw updateError;
        }
      } else {
        // Create new user
        const apiData = {
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
          "Sending create API request with data:",
          JSON.stringify(apiData, null, 2)
        );
        
        try {
          console.log("Calling createAdminUser with data");
          const response = await createAdminUser(apiData as any);
          console.log("Create API response:", response);
          
          if (response.success) {
            console.log("Create successful, preparing new user data");
            const newUser = {
              ...formData,
              id: response.data?.id || Date.now().toString(), 
              createdAt: new Date().toISOString(),
              originalId: response.data?.id || "",
            } as User;
            
            console.log("Calling onSave with new user:", newUser);
            onSave(newUser);
            
            console.log("Showing success toast");
            addToast({
              title: "موفقیت",
              description: "کاربر جدید با موفقیت ایجاد شد",
              color: "success",
            });
          } else {
            console.error("Create API returned success=false:", response.message);
            throw new Error(response.message || "خطا در ایجاد کاربر جدید");
          }
        } catch (createError) {
          console.error("Error in createAdminUser call:", createError);
          throw createError;
        }
      }
    } catch (error) {
      console.error("Error saving user:", error);
      addToast({
        title: "خطا",
        description:
          error instanceof Error ? error.message : "خطا در ذخیره اطلاعات کاربر",
        color: "danger",
      });
    } finally {
      setIsSaving(false);
    }
  };


// Display loading state while fetching user data
if (isLoading) {
  return (
    <ModalBody className="rtl">
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600">در حال بارگذاری اطلاعات کاربر...</p>
      </div>
    </ModalBody>
  );
}

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
                errorMessage={errors.firstName}
                isInvalid={!!errors.firstName}
                isRequired
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
                errorMessage={errors.lastName}
                isInvalid={!!errors.lastName}
                isRequired
                startContent={<FaUser className="text-gray-400" />}
                className="w-full"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                جنسیت
              </label>
              <div className="flex justify-start gap-3">
                {" "}
                <div className="flex justify-center">
                  {" "}
                  <label
                    className={`flex flex-col items-center justify-center p-1.5 rounded-lg cursor-pointer border transition-all w-16 h-16 ${
                      formData.gender === "male"
                        ? "border-blue-500 bg-blue-50 shadow-sm"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {" "}
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={formData.gender === "male"}
                      onChange={handleInputChange}
                      className="sr-only"
                    />{" "}
                    <FaVenusMars
                      className={`text-base mb-1 ${
                        formData.gender === "male"
                          ? "text-blue-500"
                          : "text-gray-400"
                      }`}
                    />{" "}
                    <span
                      className={`text-xs font-medium ${
                        formData.gender === "male"
                          ? "text-blue-500"
                          : "text-gray-600"
                      }`}
                    >
                      {" "}
                      مرد{" "}
                    </span>{" "}
                  </label>{" "}
                </div>{" "}
                <div className="flex justify-center">
                  {" "}
                  <label
                    className={`flex flex-col items-center justify-center p-1.5 rounded-lg cursor-pointer border transition-all w-16 h-16 ${
                      formData.gender === "female"
                        ? "border-pink-500 bg-pink-50 shadow-sm"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {" "}
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={formData.gender === "female"}
                      onChange={handleInputChange}
                      className="sr-only"
                    />{" "}
                    <FaVenusMars
                      className={`text-base mb-1 ${
                        formData.gender === "female"
                          ? "text-pink-500"
                          : "text-gray-400"
                      }`}
                    />{" "}
                    <span
                      className={`text-xs font-medium ${
                        formData.gender === "female"
                          ? "text-pink-500"
                          : "text-gray-600"
                      }`}
                    >
                      {" "}
                      زن{" "}
                    </span>{" "}
                  </label>{" "}
                </div>{" "}
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <PersianDatePicker
                label="تاریخ تولد (شمسی)"
                value={formData.birthDate || ""}
                onChange={(dateString: string) => {
                  // Clear any previous errors
                  if (errors.birthDate) {
                    setErrors(prev => {
                      const newErrors = { ...prev };
                      delete newErrors.birthDate;
                      return newErrors;
                    });
                  }
                  
                  // Update form data with the selected date
                  setFormData(prev => ({
                    ...prev,
                    birthDate: dateString
                  }));
                  
                  console.log('Selected date (Gregorian for API):', dateString);
                }}
                placeholder="انتخاب تاریخ"
                error={errors.birthDate}
                description="برای انتخاب تاریخ تولد روی فیلد کلیک کنید"
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
                errorMessage={errors.email}
                isInvalid={!!errors.email}
                isRequired
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
                errorMessage={errors.phone}
                isInvalid={!!errors.phone}
                isRequired
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
                errorMessage={errors.nationalCode}
                isInvalid={!!errors.nationalCode}
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

          <div className="flex justify-between gap-3">
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نقش کاربر
              </label>
              <div className="grid grid-cols-4 gap-2">
                {" "}
                {/* Make all role options the same size in a 4-column grid */}{" "}
                {roleGroupsWithIcons.flatMap((group: any) =>
                  group.roles.map((role: any) => (
                    <div key={role.id} className="flex justify-center">
                      {" "}
                      <label
                        className={`flex flex-col items-center justify-center p-1.5 rounded-lg cursor-pointer border transition-all w-16 h-16 ${
                          formData.role === role.id
                            ? "border-primary bg-primary-50 shadow-sm"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {" "}
                        <input
                          type="radio"
                          name="role"
                          value={role.id}
                          checked={formData.role === role.id}
                          onChange={handleInputChange}
                          className="sr-only"
                        />{" "}
                        {role.icon && <role.icon
                          className={`text-base mb-1 ${
                            formData.role === role.id
                              ? "text-primary"
                              : "text-gray-400"
                          }`}
                        />}{" "}
                        <span
                          className={`text-xs font-medium ${
                            formData.role === role.id
                              ? "text-primary"
                              : "text-gray-600"
                          }`}
                        >
                          {" "}
                          {role.name}{" "}
                        </span>{" "}
                      </label>{" "}
                    </div>
                  ))
                )}{" "}
              </div>
            </motion.div>
            <section className="flex flex-col">
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وضعیت کاربر
                </label>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="isActive-true"
                      name="isActive"
                      value="true"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                    />
                    <label
                      htmlFor="isActive-true"
                      className="mr-2 block text-sm text-gray-700"
                    >
                      فعال
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="isActive-false"
                      name="isActive"
                      value="false"
                      checked={!formData.isActive}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                    />
                    <label
                      htmlFor="isActive-false"
                      className="mr-2 block text-sm text-gray-700"
                    >
                      غیرفعال
                    </label>
                  </div>
                </div>
              </motion.div>
            </section>
            <section className="flex flex-col">
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وضعیت تعلیق
                </label>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="isBanned-true"
                      name="isBanned"
                      value="true"
                      checked={formData.isBanned}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                    />
                    <label
                      htmlFor="isBanned-true"
                      className="mr-2 block text-sm text-gray-700"
                    >
                      معلق شده
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="isBanned-false"
                      name="isBanned"
                      value="false"
                      checked={!formData.isBanned}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                    />
                    <label
                      htmlFor="isBanned-false"
                      className="mr-2 block text-sm text-gray-700"
                    >
                      فعال
                    </label>
                  </div>
                </div>
              </motion.div>
            </section>
          </div>
        </div>
      </motion.div>
    </ModalBody>

    <Divider />

    <ModalFooter>
      <div className="flex gap-2 w-full justify-between">
        <Button
          color="danger"
          variant="light"
          onPress={onCancel}
          className="bg-red-50 text-red-600 hover:bg-red-100 gap-1.5"
          isDisabled={isSaving}
        >
          <FaTimes /> انصراف
        </Button>
        <Button
          color="primary"
          variant="solid"
          onPress={() => {
            console.log('Save button clicked!');
            console.log('Current form data:', formData);
            console.log('Current user:', user);
            console.log('isSaving state:', isSaving);
            handleSubmit();
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5"
          isDisabled={isSaving}
        >
          <FaCheck /> {isSaving ? "در حال ذخیره..." : user ? "ذخیره تغییرات" : "ایجاد کاربر"}
        </Button>
      </div>
    </ModalFooter>
  </>
  );
}
