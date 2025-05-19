"use client";

import { useState, useEffect } from "react";
import {
  FaEdit,
  FaTrash,
  FaSearch,
  FaExclamationTriangle,
  FaCheck,
  FaUserPlus,
  FaFilter,
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
}

export default function UsersList({
  filterRole = "all",
  initialUsers,
  isLoading: apiLoading = false,
  refetchUsers,
  showEmptyState = false,
}: UsersListProps) {
  const [displayUsers, setDisplayUsers] = useState<User[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [currentFilter, setCurrentFilter] = useState<UserRole | "all">(
    filterRole
  );
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
      // First try using server action
      const data = await filterUsers(search, currentFilter);

      if (data && data.length > 0) {
        setDisplayUsers(data);
      } else {
        // If server action returns empty data but we have initialUsers,
        // filter them based on search and currentFilter
        const filteredUsers = initialUsers.filter((user) => {
          // Filter by search term
          const matchesSearch = search
            ? user.name.toLowerCase().includes(search.toLowerCase()) ||
              user.email.toLowerCase().includes(search.toLowerCase()) ||
              user.phone.includes(search)
            : true;

          // Filter by role
          const matchesRole =
            currentFilter === "all" ? true : user.role === currentFilter;

          return matchesSearch && matchesRole;
        });

        setDisplayUsers(filteredUsers);
      }
    } catch (error) {
      console.error("Failed to load users:", error);

      // Fallback to filtering initialUsers client-side
      const filteredUsers = initialUsers.filter((user) => {
        // Filter by search term
        const matchesSearch = search
          ? user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase()) ||
            user.phone.includes(search)
          : true;

        // Filter by role
        const matchesRole =
          currentFilter === "all" ? true : user.role === currentFilter;

        return matchesSearch && matchesRole;
      });

      setDisplayUsers(filteredUsers);

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

  // Load users when filter or search changes
  useEffect(() => {
    loadUsers();
  }, [search, currentFilter]);

  // Update displayUsers when initialUsers changes, but keep any filtering applied
  useEffect(() => {
    // Re-apply current filters instead of just setting to initialUsers
    if (search || currentFilter !== "all") {
      loadUsers();
    } else {
      setDisplayUsers(initialUsers);
    }

    // Log for debugging
    console.log(
      "Received updated initialUsers list. Length:",
      initialUsers.length
    );
  }, [initialUsers]);

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

          addToast({
            title: "ویرایش موفقیت‌آمیز",
            description: `اطلاعات کاربر ${userData.name} با موفقیت بروزرسانی شد`,
            color: "success",
            icon: <FaCheck />,
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
        await addUser(userDataWithoutId);

        addToast({
          title: "افزودن موفقیت‌آمیز",
          description: `کاربر ${userData.name} با موفقیت افزوده شد`,
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

  const getFiltersCount = () => {
    let count = 0;
    if (currentFilter !== "all") count++;
    if (search) count++;
    return count;
  };

  const clearFilters = () => {
    setSearch("");
    setCurrentFilter("all");
  };

  // Check if we should show the loading state or empty state
  const isTableLoading = isLoading || apiLoading;
  const isTableEmpty = !isTableLoading && displayUsers.length === 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="relative w-full md:w-96">
            <Input
              placeholder="جستجو در کاربران..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              startContent={<FaSearch className="text-gray-400" />}
              className="w-full"
            />
          </div>

          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="bordered"
                startContent={<FaFilter />}
                endContent={
                  getFiltersCount() > 0 ? (
                    <span className="bg-primary text-white w-5 h-5 flex items-center justify-center rounded-full text-xs">
                      {getFiltersCount()}
                    </span>
                  ) : undefined
                }
                className="border-primary text-primary hover:bg-primary/10 transition-colors"
              >
                فیلتر
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="فیلتر کاربران"
              className="p-4 min-w-[240px] bg-white rounded-lg shadow-lg border border-gray-200"
            >
              <DropdownItem
                key="role-filter"
                textValue="نقش کاربری"
                className="p-0"
              >
                <p className="font-semibold mb-3 text-gray-700">نقش کاربری</p>
                <div className="flex flex-col gap-2 bg-gray-50 p-3 rounded-lg">
                  <Button
                    size="sm"
                    variant={currentFilter === "all" ? "solid" : "light"}
                    color={currentFilter === "all" ? "primary" : "secondary"}
                    className="justify-start rounded-full"
                    onPress={() => setCurrentFilter("all")}
                  >
                    همه کاربران
                  </Button>
                  <Button
                    size="sm"
                    variant={currentFilter === "admin" ? "solid" : "light"}
                    color={currentFilter === "admin" ? "primary" : "secondary"}
                    className="justify-start rounded-full"
                    onPress={() => setCurrentFilter("admin")}
                  >
                    مدیران
                  </Button>
                  <Button
                    size="sm"
                    variant={currentFilter === "agency" ? "solid" : "light"}
                    color={currentFilter === "agency" ? "primary" : "secondary"}
                    className="justify-start rounded-full"
                    onPress={() => setCurrentFilter("agency")}
                  >
                    آژانس‌ها
                  </Button>
                  <Button
                    size="sm"
                    variant={currentFilter === "consultant" ? "solid" : "light"}
                    color={
                      currentFilter === "consultant" ? "primary" : "secondary"
                    }
                    className="justify-start rounded-full"
                    onPress={() => setCurrentFilter("consultant")}
                  >
                    مشاوران
                  </Button>
                  <Button
                    size="sm"
                    variant={currentFilter === "normal" ? "solid" : "light"}
                    color={currentFilter === "normal" ? "primary" : "secondary"}
                    className="justify-start rounded-full"
                    onPress={() => setCurrentFilter("normal")}
                  >
                    کاربران عادی
                  </Button>
                </div>
              </DropdownItem>
              <Divider className="my-3" />
              <DropdownItem
                key="clear-filters"
                className="justify-center text-danger bg-danger/5 rounded-lg hover:bg-danger/10 mt-2 p-2"
                onPress={clearFilters}
              >
                حذف فیلترها
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

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
                  در حال بارگذاری...
                </td>
              </tr>
            )}
            {isTableEmpty && (
              <tr className="bg-white border-b">
                <td
                  colSpan={9}
                  className="px-6 py-10 text-center text-gray-500"
                >
                  {showEmptyState
                    ? "کاربری یافت نشد"
                    : "در حال دریافت اطلاعات کاربران..."}
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
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4" dir="ltr">
                    {user.phone}
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
