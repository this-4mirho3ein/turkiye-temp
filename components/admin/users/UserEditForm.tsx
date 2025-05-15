"use client";

import { useState, useEffect } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import Input from "@/components/admin/ui/Input";
import Button from "@/components/admin/ui/Button";
import { ModalBody, ModalFooter, Divider } from "@heroui/react";
import { User, UserRole } from "../data/users";
import { getRoleGroups } from "../data/actions";
import { roleGroupsWithIcons } from "../data/roles-client";

interface UserEditFormProps {
  user: User | null;
  onSave: (user: User) => void;
  onCancel: () => void;
}

export default function UserEditForm({
  user,
  onSave,
  onCancel,
}: UserEditFormProps) {
  const [formData, setFormData] = useState<Omit<User, "id" | "createdAt">>({
    name: "",
    email: "",
    phone: "",
    role: "normal",
    status: "active",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverRoleGroups, setServerRoleGroups] = useState<any[]>([]);

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
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        status: user.status,
        lastLogin: user.lastLogin,
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        role: "normal",
        status: "active",
      });
    }
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

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

    if (!formData.name.trim()) {
      newErrors.name = "نام کاربر الزامی است";
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave({
        ...formData,
        id: user?.id || 0,
        createdAt: user?.createdAt || "",
      });
    }
  };

  return (
    <>
      <ModalBody>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              نام کاربر
            </label>
            <Input
              name="name"
              placeholder="نام و نام خانوادگی"
              value={formData.name}
              onChange={handleInputChange}
              isInvalid={!!errors.name}
              errorMessage={errors.name}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ایمیل
            </label>
            <Input
              name="email"
              placeholder="example@mail.com"
              value={formData.email}
              onChange={handleInputChange}
              isInvalid={!!errors.email}
              errorMessage={errors.email}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              شماره تلفن
            </label>
            <Input
              name="phone"
              placeholder="09123456789"
              value={formData.phone}
              onChange={handleInputChange}
              isInvalid={!!errors.phone}
              errorMessage={errors.phone}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              آواتار (اختیاری)
            </label>
            <Input
              name="avatar"
              placeholder="آدرس URL تصویر پروفایل"
              value={formData.avatar || ""}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              نقش کاربری
            </label>

            <div className="space-y-4">
              {roleGroupsWithIcons.map((group) => (
                <div key={group.id}>
                  <p className="text-xs text-gray-500 mb-2">{group.name}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {group.roles.map((role) => (
                      <div
                        key={role.id}
                        className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                          formData.role === role.id
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, role: role.id }))
                        }
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <role.icon
                              className={
                                formData.role === role.id
                                  ? "text-primary"
                                  : "text-gray-500"
                              }
                            />
                            <span
                              className={
                                formData.role === role.id
                                  ? "font-medium text-primary"
                                  : ""
                              }
                            >
                              {role.name}
                            </span>
                          </div>
                          {formData.role === role.id && (
                            <div className="h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                              <FaCheck className="text-white text-xs" />
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {role.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              وضعیت کاربر
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border"
            >
              <option value="active">فعال</option>
              <option value="inactive">غیرفعال</option>
              <option value="banned">مسدود</option>
            </select>
          </div>
        </div>
      </ModalBody>

      <Divider />

      <ModalFooter>
        <Button
          color="primary"
          variant="light"
          onPress={onCancel}
          startContent={<FaTimes />}
        >
          انصراف
        </Button>
        <Button
          color="primary"
          onPress={handleSubmit}
          startContent={<FaCheck />}
        >
          {user ? "بروزرسانی کاربر" : "افزودن کاربر"}
        </Button>
      </ModalFooter>
    </>
  );
}
