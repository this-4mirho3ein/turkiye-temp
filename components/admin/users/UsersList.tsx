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
} from "react-icons/fa";
import Button from "@/components/admin/ui/Button";
import Input from "@/components/admin/ui/Input";
import Avatar from "@/components/admin/ui/Avatar";
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

interface UsersListProps {
  filterRole?: UserRole | "all";
  initialUsers: User[];
}

export default function UsersList({
  filterRole = "all",
  initialUsers,
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
    setIsLoading(true);
    try {
      const data = await filterUsers(search, currentFilter);
      setDisplayUsers(data);
    } catch (error) {
      console.error("Failed to load users:", error);
      addToast({
        title: "خطا",
        description: "بارگذاری کاربران با مشکل مواجه شد",
        color: "danger",
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
      try {
        const success = await deleteUser(userToDelete.id);

        if (success) {
          // Show success toast notification for delete
          addToast({
            title: "حذف موفقیت‌آمیز",
            description: `کاربر ${userToDelete.name} با موفقیت حذف شد`,
            color: "danger",
            icon: <FaTrash />,
          });

          // Refresh the user list
          loadUsers();
        } else {
          // Show error toast
          addToast({
            title: "خطا",
            description: "حذف کاربر با مشکل مواجه شد",
            color: "danger",
            icon: <FaExclamationTriangle />,
          });
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        addToast({
          title: "خطا",
          description: "حذف کاربر با مشکل مواجه شد",
          color: "danger",
          icon: <FaExclamationTriangle />,
        });
      }

      onDeleteModalClose();
      setUserToDelete(null);
    }
  };

  const handleUserSave = async (userData: User) => {
    try {
      if (selectedUser) {
        // Update existing user
        await updateUser(userData);

        addToast({
          title: "ویرایش موفقیت‌آمیز",
          description: `اطلاعات کاربر ${userData.name} با موفقیت بروزرسانی شد`,
          color: "success",
          icon: <FaCheck />,
        });
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
      }

      // Refresh the user list
      loadUsers();
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
              >
                فیلتر
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="فیلتر کاربران"
              className="p-3 min-w-[200px]"
            >
              <DropdownItem key="role-filter" textValue="نقش کاربری">
                <p className="font-semibold mb-2">نقش کاربری</p>
                <div className="flex flex-col gap-2">
                  <Button
                    size="sm"
                    variant={currentFilter === "all" ? "solid" : "light"}
                    color={currentFilter === "all" ? "primary" : "secondary"}
                    className="justify-start"
                    onPress={() => setCurrentFilter("all")}
                  >
                    همه کاربران
                  </Button>
                  <Button
                    size="sm"
                    variant={currentFilter === "admin" ? "solid" : "light"}
                    color={currentFilter === "admin" ? "primary" : "secondary"}
                    className="justify-start"
                    onPress={() => setCurrentFilter("admin")}
                  >
                    مدیران
                  </Button>
                  <Button
                    size="sm"
                    variant={currentFilter === "agency" ? "solid" : "light"}
                    color={currentFilter === "agency" ? "primary" : "secondary"}
                    className="justify-start"
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
                    className="justify-start"
                    onPress={() => setCurrentFilter("consultant")}
                  >
                    مشاوران
                  </Button>
                  <Button
                    size="sm"
                    variant={currentFilter === "normal" ? "solid" : "light"}
                    color={currentFilter === "normal" ? "primary" : "secondary"}
                    className="justify-start"
                    onPress={() => setCurrentFilter("normal")}
                  >
                    کاربران عادی
                  </Button>
                </div>
              </DropdownItem>
              <DropdownItem
                key="clear-filters"
                className="mt-3 justify-center text-danger"
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
              <th className="px-6 py-3 text-center">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr className="bg-white border-b">
                <td
                  colSpan={8}
                  className="px-6 py-10 text-center text-gray-500"
                >
                  در حال بارگذاری...
                </td>
              </tr>
            ) : displayUsers.length > 0 ? (
              displayUsers.map((user, index) => (
                <tr
                  key={user.id}
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
                      <span className="font-medium">{user.name}</span>
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
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center space-x-2 space-x-reverse">
                      <Button
                        variant="light"
                        size="sm"
                        color="primary"
                        isIconOnly
                        onPress={() => handleEditUser(user)}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="light"
                        size="sm"
                        color="danger"
                        isIconOnly
                        onPress={() => handleDeleteClick(user)}
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="bg-white border-b">
                <td
                  colSpan={8}
                  className="px-6 py-10 text-center text-gray-500"
                >
                  کاربری یافت نشد
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
              variant="light"
              onPress={onDeleteModalClose}
            >
              انصراف
            </Button>
            <Button color="danger" onPress={confirmDelete}>
              تأیید حذف
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit User Modal */}
      <Modal isOpen={isEditModalOpen} onClose={onEditModalClose} size="xl">
        <ModalContent>
          <ModalHeader>
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
    </div>
  );
}
