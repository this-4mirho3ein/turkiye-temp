"use client";

import { useState, useEffect } from "react";
import {
  FaEdit,
  FaTrash,
  FaExclamationTriangle,
  FaCheck,
  FaUserPlus,
  FaTrashRestore,
  FaTimes,
  FaUsers,
} from "react-icons/fa";

import Button from "@/components/admin/ui/Button";
import Input from "@/components/admin/ui/Input";
import Avatar from "@/components/admin/ui/Avatar";
import Link from "next/link";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  addToast,
  Divider,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import UserStatusBadge from "./UserStatusBadge";
import UserRoleBadge from "./UserRoleBadge";
import { User, UserRole } from "../data/users";
import UserEditForm from "./UserEditForm";
import { filterUsers, addUser, updateUser, deleteUser } from "../data/actions";
import { deleteAdminUser, restoreAdminUser } from "@/controllers/makeRequest";
import { motion } from "framer-motion";

interface UsersListProps {
  filterRole?: UserRole | "all";
  initialUsers: User[];
  isLoading?: boolean;
  refetchUsers?: () => Promise<any>;
  showEmptyState?: boolean;
  searchTerm: string;
}

export default function UsersList({
  filterRole = "all",
  initialUsers,
  isLoading: apiLoading = false,
  refetchUsers,
  showEmptyState = false,
  searchTerm,
}: UsersListProps) {
  const [displayUsers, setDisplayUsers] = useState<User[]>(initialUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Modal controls
  const {
    isOpen: isEditModalOpen,
    onOpen: onEditModalOpen,
    onClose: onEditModalClose,
  } = useDisclosure();

  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure();

  // Load users using server action
  const loadUsers = async () => {
    // Don't load if we're already fetching from API
    if (apiLoading) return;

    setIsLoading(true);
    try {
      // Get all users without filtering
      const data = await filterUsers("", "all");

      if (data && data.length > 0) {
        setDisplayUsers(data);
      } else {
        // If server action returns empty data, use initialUsers
        setDisplayUsers(initialUsers);
      }
    } catch (error) {
      console.error("Failed to load users:", error);

      // Fallback to initialUsers
      setDisplayUsers(initialUsers);

      addToast({
        title: "هشدار",
        description:
          "بارگیری اطلاعات سرور با مشکل مواجه شد. نمایش اطلاعات محلی.",
        color: "warning",
        icon: <FaExclamationTriangle />,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load users when component mounts or refetchUsers changes
  useEffect(() => {
    loadUsers();
  }, [refetchUsers]);

  // Update displayUsers when initialUsers changes
  useEffect(() => {
    if (!searchTerm) {
      setDisplayUsers(initialUsers);
      return;
    }
    const lower = searchTerm.toLowerCase();
    const filtered = initialUsers.filter((user) =>
      [user.name, user.email, user.phone].some((field) =>
        field?.toLowerCase().includes(lower)
      )
    );
    setDisplayUsers(filtered);
  }, [searchTerm, initialUsers]);

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    onEditModalOpen();
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    onDeleteModalOpen();
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    onEditModalOpen();
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      setIsLoading(true);
      try {
        // Check if we have an originalId (API ID) to use
        if (userToDelete.originalId) {
          // Use the API function for deletion
          const response = await deleteAdminUser(userToDelete.originalId);

          if (response.success) {
            // Show success toast notification for delete
            addToast({
              title: "حذف موفقیت‌آمیز",
              description:
                response.message ||
                `کاربر ${userToDelete.name} با موفقیت حذف شد`,
              color: "danger",
              icon: <FaTrash />,
            });

            // Refresh the user list from API
            if (refetchUsers) {
              await refetchUsers();
            } else {
              await loadUsers();
            }
          } else {
            // Show error toast
            addToast({
              title: "خطا",
              description: response.message || "حذف کاربر با مشکل مواجه شد",
              color: "danger",
              icon: <FaExclamationTriangle />,
            });
          }
        } else {
          // Fallback to server action for local users
          const success = await deleteUser(userToDelete.id);

          if (success) {
            // Show success toast notification for delete
            addToast({
              title: "حذف موفقیت‌آمیز",
              description: `کاربر ${userToDelete.name} با موفقیت حذف شد`,
              color: "danger",
              icon: <FaTrash />,
            });

            // Refresh the user list from API
            if (refetchUsers) {
              await refetchUsers();
            } else {
              await loadUsers();
            }
          } else {
            // Show error toast
            addToast({
              title: "خطا",
              description: "حذف کاربر با مشکل مواجه شد",
              color: "danger",
              icon: <FaExclamationTriangle />,
            });
          }
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        addToast({
          title: "خطا",
          description: "حذف کاربر با مشکل مواجه شد",
          color: "danger",
          icon: <FaExclamationTriangle />,
        });
      } finally {
        setIsLoading(false);
        onDeleteModalClose();
        setUserToDelete(null);
      }
    }
  };

  const handleRestoreUser = async (user: User) => {
    if (!user.originalId) {
      addToast({
        title: "خطا",
        description: "شناسه کاربر برای بازیابی یافت نشد",
        color: "danger",
        icon: <FaExclamationTriangle />,
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await restoreAdminUser(user.originalId);

      if (response.success) {
        addToast({
          title: "بازیابی موفقیت‌آمیز",
          description: `کاربر ${user.name} با موفقیت بازیابی شد`,
          color: "success",
          icon: <FaCheck />,
        });

        // Refresh the user list from API
        if (refetchUsers) {
          await refetchUsers();
        } else {
          await loadUsers();
        }
      } else {
        addToast({
          title: "خطا",
          description: response.message || "بازیابی کاربر با مشکل مواجه شد",
          color: "danger",
          icon: <FaExclamationTriangle />,
        });
      }
    } catch (error) {
      console.error("Error restoring user:", error);
      addToast({
        title: "خطا",
        description: "بازیابی کاربر با مشکل مواجه شد",
        color: "danger",
        icon: <FaExclamationTriangle />,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserSave = async (userData: User) => {
    try {
      if (selectedUser) {
        // If the user has an originalId, it was loaded from the API and should be updated there
        if (selectedUser.originalId) {
          // API was already called in UserEditForm, just refresh the list
          if (refetchUsers) {
            await refetchUsers();
          } else {
            await loadUsers();
          }

          // Check if we have a response message from the API
          const responseMessage = (userData as any)._responseMessage;
          const isSuccess = (userData as any)._responseStatus !== false;
          
          console.log('Using response message for toast:', responseMessage);
          
          addToast({
            title: isSuccess ? "ویرایش موفقیت‌آمیز" : "خطا",
            description: responseMessage || `اطلاعات کاربر ${userData.name} با موفقیت بروزرسانی شد`,
            color: isSuccess ? "success" : "danger",
            icon: isSuccess ? <FaCheck /> : <FaExclamationTriangle />,
          });
        } else {
          // Update existing local user
          await updateUser(userData);

          addToast({
            title: "ویرایش موفقیت‌آمیز",
            description: `اطلاعات کاربر ${userData.name} با موفقیت بروزرسانی شد`,
            color: "success",
            icon: <FaCheck />,
          });

          // Refresh the user list
          if (refetchUsers) {
            await refetchUsers();
          } else {
            await loadUsers();
          }
        }
      } else {
        // Add new user
        const { id, createdAt, ...userDataWithoutId } = userData;

        // The API call and toast notification are handled in the UserEditForm
        // Here we only need to refresh the user list
        await addUser(userDataWithoutId);

        // Refresh the user list
        if (refetchUsers) {
          await refetchUsers();
        } else {
          await loadUsers();
        }
      }
    } catch (error) {
      console.error("Error saving user:", error);
      addToast({
        title: "خطا",
        description: "ذخیره اطلاعات کاربر با مشکل مواجه شد",
        color: "danger",
        icon: <FaExclamationTriangle />,
      });
    }

    onEditModalClose();
  };

  // Check if we should show the loading state or empty state
  const isTableLoading = apiLoading || isLoading;
  const isTableEmpty = !isTableLoading && displayUsers.length === 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          color="primary"
          startContent={<FaUserPlus />}
          onPress={handleAddUser}
          className="shrink-0"
        >
          افزودن کاربر جدید
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm text-right">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-center">#</th>
              <th className="px-6 py-3">کاربر</th>
              <th className="px-6 py-3">ایمیل</th>
              <th className="px-6 py-3">تلفن</th>
              <th className="px-6 py-3">نقش</th>
              <th className="px-6 py-3">وضعیت</th>
              <th className="px-6 py-3">تاریخ ثبت نام</th>
              <th className="px-6 py-3">وضعیت حذف</th>
              <th className="px-6 py-3 text-center">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {isTableLoading && (
              <tr className="bg-white border-b">
                <td
                  colSpan={9}
                  className="px-6 py-10 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center justify-center py-6">
                    <div
                      className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                      role="status"
                    ></div>
                    <span className="mt-4 text-gray-600">
                      در حال بارگذاری اطلاعات کاربران...
                    </span>
                  </div>
                </td>
              </tr>
            )}
            {isTableEmpty && (
              <tr className="bg-white border-b">
                <td
                  colSpan={9}
                  className="px-6 py-10 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center justify-center py-6">
                    <FaUsers className="text-gray-300 text-5xl mb-3" />
                    <span className="text-gray-600">
                      {showEmptyState
                        ? "کاربری یافت نشد"
                        : "در حال دریافت اطلاعات کاربران..."}
                    </span>
                  </div>
                </td>
              </tr>
            )}
            {displayUsers.length > 0 &&
              displayUsers.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="bg-white border-b hover:bg-gray-50"
                >
                  <td className="px-6 py-4 text-center">{index + 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={user.avatar}
                        name={user.name}
                        size="sm"
                        className="flex-shrink-0"
                      />
                      <Link
                        href={`/admin/users/${user.originalId || user.id}`}
                        className="font-medium text-primary hover:text-primary-dark hover:underline transition-colors"
                      >
                        {user.name}
                      </Link>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {user.displayEmail ? user.email : 
                      <span className="text-gray-400 italic">مخفی شده</span>
                    }
                  </td>
                  <td className="px-6 py-4" dir="ltr">
                    {user.displayMobile ? user.phone : 
                      <span className="text-gray-400 italic">مخفی شده</span>
                    }
                  </td>
                  <td className="px-6 py-4">
                    <UserRoleBadge role={user.role} />
                  </td>
                  <td className="px-6 py-4">
                    <UserStatusBadge status={user.status} />
                  </td>
                  <td className="px-6 py-4">{user.createdAt}</td>
                  <td className="px-6 py-4">
                    {user.isDeleted ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        حذف شده
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        فعال
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center items-center gap-3">
                      <Button
                        variant="solid"
                        size="sm"
                        color="primary"
                        onPress={() => handleEditUser(user)}
                        className="gap-1.5 bg-blue-500 hover:bg-blue-600 text-white"
                        aria-label="ویرایش"
                        tabIndex={0}
                      >
                        <FaEdit /> ویرایش
                      </Button>
                      {user.isDeleted ? (
                        <Button
                          variant="solid"
                          size="sm"
                          color="success"
                          onPress={() => handleRestoreUser(user)}
                          className="gap-1.5 bg-green-500 hover:bg-green-600 text-white"
                          aria-label="بازیابی"
                          tabIndex={0}
                        >
                          <FaTrashRestore /> بازیابی
                        </Button>
                      ) : (
                        <Button
                          variant="solid"
                          size="sm"
                          color="danger"
                          onPress={() => handleDeleteClick(user)}
                          className="gap-1.5 bg-red-500 hover:bg-red-600 text-white"
                          aria-label="حذف"
                          tabIndex={0}
                        >
                          <FaTrash /> حذف
                        </Button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={onEditModalClose}
        size="3xl"
        className="rtl"
      >
        <ModalContent className="max-w-4xl p-0">
          <ModalHeader className="bg-gradient-to-r from-primary-50 to-indigo-50 text-xl">
            {selectedUser ? "ویرایش کاربر" : "افزودن کاربر جدید"}
          </ModalHeader>
          <Divider />
          <UserEditForm
            user={selectedUser}
            onSave={handleUserSave}
            onCancel={onEditModalClose}
          />
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={onDeleteModalClose} size="sm">
        <ModalContent>
          <ModalHeader className="text-danger flex items-center gap-2">
            <FaExclamationTriangle />
            <span>تأیید حذف</span>
          </ModalHeader>
          <Divider />
          <ModalBody>
            <div className="py-4 text-center">
              <p className="mb-4">
                آیا از حذف کاربر {userToDelete?.name} اطمینان دارید؟
              </p>
              <p className="text-sm text-gray-500">
                این عملیات قابل بازگشت نیست.
              </p>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              variant="solid"
              onPress={onDeleteModalClose}
              className="bg-blue-500 hover:bg-blue-600 text-white gap-1.5"
              isDisabled={isLoading}
            >
              <FaTimes /> انصراف
            </Button>
            <Button
              color="danger"
              variant="solid"
              onPress={confirmDelete}
              className="bg-red-500 hover:bg-red-600 text-white gap-1.5"
              isDisabled={isLoading}
            >
              <FaTrash /> {isLoading ? "در حال حذف..." : "تأیید حذف"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
