"use client";

import { useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Spinner,
  Chip,
  Input,
  Select,
  SelectItem,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Avatar,
} from "@heroui/react";
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrashAlt,
  FaUserTie,
  FaUsersCog,
  FaPhoneAlt,
  FaEnvelope,
  FaCalendarAlt,
} from "react-icons/fa";
import { Agency, Staff } from "../data/agencies";
import {
  addStaffMember,
  updateStaffMember,
  removeStaffMember,
} from "../data/agency-actions";
import React from "react";

interface AgencyStaffProps {
  initialAgencies: Agency[];
}

export default function AgencyStaff({ initialAgencies }: AgencyStaffProps) {
  const [agencies, setAgencies] = useState<Agency[]>(initialAgencies);
  const [staffMembers, setStaffMembers] = useState<
    Array<Staff & { agencyId: number; agencyName: string }>
  >(extractStaffMembers(initialAgencies));
  const [filteredStaff, setFilteredStaff] = useState(staffMembers);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<
    "all" | "manager" | "consultant"
  >("all");
  const [agencyFilter, setAgencyFilter] = useState<number | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);

  const {
    isOpen: isAddModalOpen,
    onOpen: openAddModal,
    onClose: closeAddModal,
  } = useDisclosure();
  const {
    isOpen: isEditModalOpen,
    onOpen: openEditModal,
    onClose: closeEditModal,
  } = useDisclosure();
  const {
    isOpen: isDeleteModalOpen,
    onOpen: openDeleteModal,
    onClose: closeDeleteModal,
  } = useDisclosure();

  const [selectedStaff, setSelectedStaff] = useState<
    (Staff & { agencyId: number; agencyName: string }) | null
  >(null);
  const [formData, setFormData] = useState<
    Omit<Staff, "id"> & { id?: number; agencyId: number }
  >({
    name: "",
    role: "consultant",
    phone: "",
    email: "",
    avatar: "",
    joinDate: "",
    status: "active",
    agencyId: 0,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Extract staff members from agencies
  function extractStaffMembers(agencies: Agency[]) {
    const allStaff: Array<Staff & { agencyId: number; agencyName: string }> =
      [];

    agencies.forEach((agency) => {
      agency.staff.forEach((staff) => {
        allStaff.push({
          ...staff,
          agencyId: agency.id,
          agencyName: agency.name,
        });
      });
    });

    return allStaff;
  }

  // Handle search and filtering
  const handleFilter = () => {
    setIsLoading(true);

    let filtered = [...staffMembers];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (staff) =>
          staff.name.toLowerCase().includes(term) ||
          staff.email.toLowerCase().includes(term) ||
          staff.phone.includes(term) ||
          staff.agencyName.toLowerCase().includes(term)
      );
    }

    // Apply role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter((staff) => staff.role === roleFilter);
    }

    // Apply agency filter
    if (agencyFilter !== "all") {
      filtered = filtered.filter((staff) => staff.agencyId === agencyFilter);
    }

    setFilteredStaff(filtered);
    setCurrentPage(1);
    setIsLoading(false);
  };

  // Calculate pagination
  const pages = Math.ceil(filteredStaff.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedStaff = filteredStaff.slice(startIndex, endIndex);

  // Role badge colors
  const getRoleColor = (role: string) => {
    switch (role) {
      case "manager":
        return "primary";
      case "consultant":
        return "success";
      default:
        return "default";
    }
  };

  // Role text
  const getRoleText = (role: string) => {
    switch (role) {
      case "manager":
        return "مدیر";
      case "consultant":
        return "مشاور";
      default:
        return role;
    }
  };

  // Status badge colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "inactive":
        return "warning";
      default:
        return "default";
    }
  };

  // Status text
  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "فعال";
      case "inactive":
        return "غیرفعال";
      default:
        return status;
    }
  };

  // Handle form input change
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "نام الزامی است";
    }

    if (!formData.phone.trim()) {
      errors.phone = "شماره تلفن الزامی است";
    } else if (!/^\d+$/.test(formData.phone.replace(/[-\s]/g, ""))) {
      errors.phone = "شماره تلفن باید فقط شامل اعداد باشد";
    }

    if (!formData.email.trim()) {
      errors.email = "ایمیل الزامی است";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "فرمت ایمیل صحیح نیست";
    }

    if (!formData.joinDate.trim()) {
      errors.joinDate = "تاریخ پیوستن الزامی است";
    }

    if (formData.agencyId === 0) {
      errors.agencyId = "انتخاب آژانس الزامی است";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle add new staff member
  const handleAddStaff = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const { id, agencyId, ...staffData } = formData;

      const newStaff = await addStaffMember(agencyId, staffData);

      // Update local state
      const updatedAgencies = agencies.map((agency) => {
        if (agency.id === agencyId) {
          return {
            ...agency,
            staff: [...agency.staff, newStaff],
          };
        }
        return agency;
      });

      setAgencies(updatedAgencies);

      // Update staff list
      const agencyName = agencies.find((a) => a.id === agencyId)?.name || "";
      const newStaffWithAgency = {
        ...newStaff,
        agencyId,
        agencyName,
      };

      setStaffMembers((prev) => [...prev, newStaffWithAgency]);
      setFilteredStaff((prev) => [...prev, newStaffWithAgency]);

      // Reset form and close modal
      setFormData({
        name: "",
        role: "consultant",
        phone: "",
        email: "",
        avatar: "",
        joinDate: "",
        status: "active",
        agencyId: 0,
      });

      closeAddModal();
    } catch (error) {
      console.error("Error adding staff member:", error);
      setFormErrors({
        submit: "خطا در ثبت اطلاعات. لطفاً دوباره تلاش کنید.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle edit staff member
  const handleEditStaff = async () => {
    if (!validateForm() || !selectedStaff) {
      return;
    }

    setIsLoading(true);

    try {
      const { agencyId, ...staffData } = formData;

      if (agencyId !== selectedStaff.agencyId) {
        // If agency changed, remove from old agency and add to new one
        await removeStaffMember(selectedStaff.agencyId, selectedStaff.id);
        await addStaffMember(agencyId, staffData);
      } else {
        // Update in current agency
        await updateStaffMember(agencyId, {
          ...staffData,
          id: selectedStaff.id,
        } as Staff);
      }

      // Update local state
      const updatedAgencies = agencies.map((agency) => {
        if (agency.id === selectedStaff.agencyId) {
          return {
            ...agency,
            staff: agency.staff.filter((s) => s.id !== selectedStaff.id),
          };
        } else if (agency.id === agencyId) {
          const updatedStaff = {
            ...staffData,
            id: selectedStaff.id,
          };

          const existingStaffIndex = agency.staff.findIndex(
            (s) => s.id === selectedStaff.id
          );

          if (existingStaffIndex !== -1) {
            // Update existing staff
            const updatedStaffList = [...agency.staff];
            updatedStaffList[existingStaffIndex] = updatedStaff as Staff;
            return {
              ...agency,
              staff: updatedStaffList,
            };
          } else {
            // Add to new agency
            return {
              ...agency,
              staff: [...agency.staff, updatedStaff as Staff],
            };
          }
        }
        return agency;
      });

      setAgencies(updatedAgencies);

      // Update staff list
      const agencyName = agencies.find((a) => a.id === agencyId)?.name || "";
      const updatedStaffWithAgency = {
        ...staffData,
        id: selectedStaff.id,
        agencyId,
        agencyName,
      };

      setStaffMembers((prev) =>
        prev.map((s) =>
          s.id === selectedStaff.id && s.agencyId === selectedStaff.agencyId
            ? updatedStaffWithAgency
            : s
        )
      );

      setFilteredStaff((prev) =>
        prev.map((s) =>
          s.id === selectedStaff.id && s.agencyId === selectedStaff.agencyId
            ? updatedStaffWithAgency
            : s
        )
      );

      // Reset form and close modal
      closeEditModal();
    } catch (error) {
      console.error("Error updating staff member:", error);
      setFormErrors({
        submit: "خطا در بروزرسانی اطلاعات. لطفاً دوباره تلاش کنید.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete staff member
  const handleDeleteStaff = async () => {
    if (!selectedStaff) return;

    setIsLoading(true);

    try {
      const success = await removeStaffMember(
        selectedStaff.agencyId,
        selectedStaff.id
      );

      if (success) {
        // Update local state
        const updatedAgencies = agencies.map((agency) => {
          if (agency.id === selectedStaff.agencyId) {
            return {
              ...agency,
              staff: agency.staff.filter((s) => s.id !== selectedStaff.id),
            };
          }
          return agency;
        });

        setAgencies(updatedAgencies);

        // Update staff lists
        setStaffMembers((prev) =>
          prev.filter(
            (s) =>
              s.id !== selectedStaff.id || s.agencyId !== selectedStaff.agencyId
          )
        );

        setFilteredStaff((prev) =>
          prev.filter(
            (s) =>
              s.id !== selectedStaff.id || s.agencyId !== selectedStaff.agencyId
          )
        );
      }

      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting staff member:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          placeholder="جستجو..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          startContent={<FaSearch className="text-gray-400" />}
        />

        <Select
          placeholder="نقش"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as any)}
        >
          <SelectItem key="all">همه نقش‌ها</SelectItem>
          <SelectItem key="manager">مدیر</SelectItem>
          <SelectItem key="consultant">مشاور</SelectItem>
        </Select>

        <Select
          placeholder="آژانس"
          value={agencyFilter.toString()}
          onChange={(e) =>
            setAgencyFilter(
              e.target.value === "all" ? "all" : parseInt(e.target.value)
            )
          }
        >
          <SelectItem key="all">همه آژانس‌ها</SelectItem>
          {/* @ts-ignore */}
          <>
            {agencies.map((agency) => (
              <SelectItem key={agency.id.toString()}>{agency.name}</SelectItem>
            ))}
          </>
        </Select>

        <div className="flex gap-2">
          <Button color="primary" className="flex-1" onClick={handleFilter}>
            اعمال فیلتر
          </Button>

          <Button
            color="success"
            startContent={<FaPlus />}
            onClick={() => {
              setFormData({
                name: "",
                role: "consultant",
                phone: "",
                email: "",
                avatar: "",
                joinDate: "",
                status: "active",
                agencyId: 0,
              });
              setFormErrors({});
              openAddModal();
            }}
          >
            افزودن
          </Button>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-lg overflow-hidden">
        <Table
          aria-label="جدول مدیران و مشاوران آژانس‌ها"
          classNames={{
            base: "min-h-[400px]",
            table: "min-w-full",
          }}
        >
          <TableHeader>
            <TableColumn width={60} className="text-right">
              ردیف
            </TableColumn>
            <TableColumn className="text-right">نام</TableColumn>
            <TableColumn className="text-right">آژانس</TableColumn>
            <TableColumn className="text-right">نقش</TableColumn>
            <TableColumn className="text-right">تلفن</TableColumn>
            <TableColumn className="text-right">ایمیل</TableColumn>
            <TableColumn className="text-right">تاریخ پیوستن</TableColumn>
            <TableColumn className="text-right">وضعیت</TableColumn>
            <TableColumn className="text-right">عملیات</TableColumn>
          </TableHeader>

          <TableBody
            isLoading={isLoading}
            loadingContent={<Spinner color="primary" />}
            emptyContent="هیچ مدیر یا مشاوری یافت نشد"
          >
            {paginatedStaff.map((staff, index) => (
              <TableRow key={`${staff.agencyId}-${staff.id}`}>
                <TableCell>{startIndex + index + 1}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar src={staff.avatar} name={staff.name} size="sm" />
                    <span className="font-medium">{staff.name}</span>
                  </div>
                </TableCell>
                <TableCell>{staff.agencyName}</TableCell>
                <TableCell>
                  <Chip
                    color={getRoleColor(staff.role)}
                    variant="flat"
                    size="sm"
                  >
                    {getRoleText(staff.role)}
                  </Chip>
                </TableCell>
                <TableCell dir="ltr" className="text-right">
                  {staff.phone}
                </TableCell>
                <TableCell>{staff.email}</TableCell>
                <TableCell dir="ltr" className="text-right">
                  {staff.joinDate}
                </TableCell>
                <TableCell>
                  <Chip
                    color={getStatusColor(staff.status)}
                    variant="flat"
                    size="sm"
                  >
                    {getStatusText(staff.status)}
                  </Chip>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2 space-x-reverse">
                    <Button
                      size="sm"
                      variant="light"
                      color="primary"
                      onClick={() => {
                        setSelectedStaff(staff);
                        setFormData({
                          id: staff.id,
                          name: staff.name,
                          role: staff.role,
                          phone: staff.phone,
                          email: staff.email,
                          avatar: staff.avatar || "",
                          joinDate: staff.joinDate,
                          status: staff.status,
                          agencyId: staff.agencyId,
                        });
                        setFormErrors({});
                        openEditModal();
                      }}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      size="sm"
                      variant="light"
                      color="danger"
                      onClick={() => {
                        setSelectedStaff(staff);
                        openDeleteModal();
                      }}
                    >
                      <FaTrashAlt />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex justify-between items-center p-4">
          <div className="text-sm text-gray-600">
            نمایش {startIndex + 1} تا {Math.min(endIndex, filteredStaff.length)}{" "}
            از {filteredStaff.length} نفر
          </div>

          <Pagination
            total={pages}
            page={currentPage}
            onChange={setCurrentPage}
            color="primary"
            showControls
          />
        </div>
      </div>

      {/* Add/Edit Staff Modal */}
      <Modal
        isOpen={isAddModalOpen || isEditModalOpen}
        onClose={isAddModalOpen ? closeAddModal : closeEditModal}
        size="lg"
      >
        <ModalContent>
          <ModalHeader>
            {isAddModalOpen ? "افزودن مدیر/مشاور جدید" : "ویرایش مدیر/مشاور"}
          </ModalHeader>

          <ModalBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="نام و نام خانوادگی"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                isRequired
                isInvalid={!!formErrors.name}
                errorMessage={formErrors.name}
                startContent={<FaUserTie className="text-gray-400" />}
              />

              <Select
                label="نقش"
                name="role"
                selectedKeys={[formData.role]}
                onChange={handleInputChange}
                isRequired
                startContent={<FaUsersCog className="text-gray-400" />}
              >
                <SelectItem key="manager">مدیر</SelectItem>
                <SelectItem key="consultant">مشاور</SelectItem>
              </Select>

              <Input
                label="شماره تلفن"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                isRequired
                isInvalid={!!formErrors.phone}
                errorMessage={formErrors.phone}
                startContent={<FaPhoneAlt className="text-gray-400" />}
              />

              <Input
                label="ایمیل"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                isRequired
                isInvalid={!!formErrors.email}
                errorMessage={formErrors.email}
                startContent={<FaEnvelope className="text-gray-400" />}
              />

              <Input
                label="آواتار (آدرس URL)"
                name="avatar"
                value={formData.avatar}
                onChange={handleInputChange}
                startContent={
                  formData.avatar ? (
                    <Avatar
                      src={formData.avatar}
                      alt={formData.name}
                      size="sm"
                      className="ml-1"
                    />
                  ) : null
                }
              />

              <Input
                label="تاریخ پیوستن"
                name="joinDate"
                value={formData.joinDate}
                onChange={handleInputChange}
                isRequired
                isInvalid={!!formErrors.joinDate}
                errorMessage={formErrors.joinDate}
                placeholder="مثال: ۱۴۰۱/۰۶/۱۵"
                startContent={<FaCalendarAlt className="text-gray-400" />}
              />

              <Select
                label="وضعیت"
                name="status"
                selectedKeys={[formData.status]}
                onChange={handleInputChange}
                isRequired
              >
                <SelectItem key="active">فعال</SelectItem>
                <SelectItem key="inactive">غیرفعال</SelectItem>
              </Select>

              <Select
                label="آژانس"
                name="agencyId"
                selectedKeys={[formData.agencyId.toString()]}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    agencyId: parseInt(e.target.value),
                  });

                  if (formErrors.agencyId) {
                    setFormErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.agencyId;
                      return newErrors;
                    });
                  }
                }}
                isRequired
                isInvalid={!!formErrors.agencyId}
                errorMessage={formErrors.agencyId}
              >
                <SelectItem key="0" isDisabled>
                  انتخاب آژانس
                </SelectItem>
                {/* @ts-ignore */}
                <>
                  {agencies.map((agency) => (
                    <SelectItem key={agency.id.toString()}>
                      {agency.name}
                    </SelectItem>
                  ))}
                </>
              </Select>
            </div>

            {formErrors.submit && (
              <div className="text-red-600 mt-4">{formErrors.submit}</div>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              color="primary"
              onClick={isAddModalOpen ? handleAddStaff : handleEditStaff}
              isLoading={isLoading}
              isDisabled={isLoading}
            >
              {isAddModalOpen ? "افزودن" : "بروزرسانی"}
            </Button>
            <Button
              color="default"
              onClick={isAddModalOpen ? closeAddModal : closeEditModal}
              isDisabled={isLoading}
            >
              انصراف
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal} size="sm">
        <ModalContent>
          {selectedStaff && (
            <>
              <ModalHeader>حذف مدیر/مشاور</ModalHeader>

              <ModalBody>
                <p className="text-center">
                  آیا از حذف "{selectedStaff.name}" از آژانس "
                  {selectedStaff.agencyName}" اطمینان دارید؟
                </p>
                <p className="text-center text-sm text-red-500 mt-2">
                  این عملیات قابل بازگشت نیست.
                </p>
              </ModalBody>

              <ModalFooter className="flex justify-center">
                <Button
                  color="danger"
                  onClick={handleDeleteStaff}
                  isLoading={isLoading}
                  isDisabled={isLoading}
                >
                  حذف
                </Button>
                <Button color="default" onClick={closeDeleteModal}>
                  انصراف
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
