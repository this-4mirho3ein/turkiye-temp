"use client";

import { useState, useEffect } from "react";
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
  Button,
  Input,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Tooltip,
} from "@heroui/react";
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrashAlt,
  FaCheck,
  FaTimes,
  FaStar,
} from "react-icons/fa";
import {
  filterAgencies,
  getUniqueCities,
  deleteAgency,
  updateAgency,
} from "../data/agency-actions";
import { Agency } from "../data/agencies";
import AgencyForm from "./AgencyForm";

interface AgenciesListProps {
  initialAgencies: Agency[];
}

export default function AgenciesList({ initialAgencies }: AgenciesListProps) {
  const [agencies, setAgencies] = useState<Agency[]>(initialAgencies);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "pending" | "suspended"
  >("all");
  const [cityFilter, setCityFilter] = useState("");
  const [cities, setCities] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalAgencies, setTotalAgencies] = useState(initialAgencies.length);

  const {
    isOpen: isDeleteModalOpen,
    onOpen: openDeleteModal,
    onClose: closeDeleteModal,
  } = useDisclosure();
  const {
    isOpen: isEditModalOpen,
    onOpen: openEditModal,
    onClose: closeEditModal,
  } = useDisclosure();
  const {
    isOpen: isAddModalOpen,
    onOpen: openAddModal,
    onClose: closeAddModal,
  } = useDisclosure();

  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);

  // Fetch cities for filter
  useEffect(() => {
    const loadCities = async () => {
      const citiesList = await getUniqueCities();
      setCities(citiesList);
    };

    loadCities();
  }, []);

  // Search and filter agencies
  useEffect(() => {
    const fetchFilteredAgencies = async () => {
      setIsLoading(true);
      try {
        const filteredAgencies = await filterAgencies(
          searchTerm,
          statusFilter,
          cityFilter
        );

        setAgencies(filteredAgencies);
        setTotalAgencies(filteredAgencies.length);
      } catch (error) {
        console.error("Error filtering agencies:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilteredAgencies();
  }, [searchTerm, statusFilter, cityFilter]);

  // Handle status badge colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "pending":
        return "warning";
      case "suspended":
        return "danger";
      default:
        return "default";
    }
  };

  // Handle status text
  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "فعال";
      case "pending":
        return "در انتظار تایید";
      case "suspended":
        return "تعلیق شده";
      default:
        return status;
    }
  };

  // Handle delete agency
  const handleDeleteAgency = async () => {
    if (!selectedAgency) return;

    setIsLoading(true);
    try {
      const success = await deleteAgency(selectedAgency.id);

      if (success) {
        setAgencies((prevAgencies) =>
          prevAgencies.filter((agency) => agency.id !== selectedAgency.id)
        );
        setTotalAgencies((prev) => prev - 1);
      }
    } catch (error) {
      console.error("Error deleting agency:", error);
    } finally {
      setIsLoading(false);
      closeDeleteModal();
    }
  };

  // Handle agency status change
  const handleStatusChange = async (
    agency: Agency,
    newStatus: "active" | "pending" | "suspended"
  ) => {
    setIsLoading(true);
    try {
      const updatedAgency = await updateAgency({
        ...agency,
        status: newStatus,
      });

      setAgencies((prevAgencies) =>
        prevAgencies.map((a) => (a.id === updatedAgency.id ? updatedAgency : a))
      );
    } catch (error) {
      console.error("Error updating agency status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate pagination
  const pages = Math.ceil(totalAgencies / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedAgencies = agencies.slice(startIndex, endIndex);

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Handle status filter change
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value as "all" | "active" | "pending" | "suspended");
    setCurrentPage(1);
  };

  // Handle city filter change
  const handleCityFilterChange = (value: string) => {
    setCityFilter(value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          placeholder="جستجو..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          startContent={<FaSearch className="text-gray-400" />}
        />

        <Select
          placeholder="وضعیت"
          value={statusFilter}
          onChange={(e) => handleStatusFilterChange(e.target.value)}
        >
          <SelectItem value="all">همه</SelectItem>
          <SelectItem value="active">فعال</SelectItem>
          <SelectItem value="pending">در انتظار تایید</SelectItem>
          <SelectItem value="suspended">تعلیق شده</SelectItem>
        </Select>

        <Select
          placeholder="شهر"
          value={cityFilter}
          onChange={(e) => handleCityFilterChange(e.target.value)}
        >
          <SelectItem value="">همه شهرها</SelectItem>
          {cities.map((city) => (
            <SelectItem key={city} value={city}>
              {city}
            </SelectItem>
          ))}
        </Select>
      </div>

      {/* Add New Agency Button */}
      <div className="flex justify-end">
        <Button
          color="primary"
          startContent={<FaPlus />}
          onClick={() => {
            setSelectedAgency(null);
            openAddModal();
          }}
        >
          افزودن آژانس جدید
        </Button>
      </div>

      {/* Agencies Table */}
      <div className="bg-white rounded-lg overflow-hidden">
        <Table
          aria-label="جدول آژانس‌های املاک"
          classNames={{
            base: "min-h-[400px]",
            table: "min-w-full",
          }}
        >
          <TableHeader>
            <TableColumn width={60} className="text-right">
              ردیف
            </TableColumn>
            <TableColumn className="text-right">نام آژانس</TableColumn>
            <TableColumn className="text-right">شهر</TableColumn>
            <TableColumn className="text-right">تلفن</TableColumn>
            <TableColumn className="text-right">امتیاز</TableColumn>
            <TableColumn className="text-right">وضعیت</TableColumn>
            <TableColumn className="text-right">عملیات</TableColumn>
          </TableHeader>

          <TableBody
            isLoading={isLoading}
            loadingContent={<Spinner color="primary" />}
            emptyContent="هیچ آژانسی یافت نشد"
          >
            {paginatedAgencies.map((agency, index) => (
              <TableRow key={agency.id}>
                <TableCell>{startIndex + index + 1}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {agency.logo && (
                      <img
                        src={agency.logo}
                        alt={agency.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <p className="font-medium">{agency.name}</p>
                      <p className="text-xs text-gray-500">{agency.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{agency.city}</TableCell>
                <TableCell dir="ltr" className="text-right">
                  {agency.phone}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <FaStar className="text-yellow-400" />
                    <span>{agency.rating}</span>
                    <span className="text-xs text-gray-500">
                      ({agency.reviewsCount})
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Chip
                    color={getStatusColor(agency.status)}
                    variant="flat"
                    size="sm"
                  >
                    {getStatusText(agency.status)}
                  </Chip>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {agency.status !== "active" && (
                      <Tooltip content="تایید">
                        <button
                          onClick={() => handleStatusChange(agency, "active")}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                        >
                          <FaCheck />
                        </button>
                      </Tooltip>
                    )}

                    {agency.status !== "suspended" && (
                      <Tooltip content="تعلیق">
                        <button
                          onClick={() =>
                            handleStatusChange(agency, "suspended")
                          }
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <FaTimes />
                        </button>
                      </Tooltip>
                    )}

                    <Tooltip content="ویرایش">
                      <button
                        onClick={() => {
                          setSelectedAgency(agency);
                          openEditModal();
                        }}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <FaEdit />
                      </button>
                    </Tooltip>

                    <Tooltip content="حذف">
                      <button
                        onClick={() => {
                          setSelectedAgency(agency);
                          openDeleteModal();
                        }}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <FaTrashAlt />
                      </button>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex justify-between items-center p-4">
          <div className="text-sm text-gray-600">
            نمایش {startIndex + 1} تا {Math.min(endIndex, totalAgencies)} از{" "}
            {totalAgencies} آژانس
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

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal} size="sm">
        <ModalContent>
          <ModalHeader className="text-center">حذف آژانس</ModalHeader>
          <ModalBody>
            <p className="text-center">
              آیا از حذف آژانس "{selectedAgency?.name}" اطمینان دارید؟
            </p>
            <p className="text-center text-sm text-red-500 mt-2">
              این عملیات غیرقابل بازگشت است.
            </p>
          </ModalBody>
          <ModalFooter className="flex justify-center gap-2">
            <Button
              color="danger"
              onClick={handleDeleteAgency}
              disabled={isLoading}
            >
              {isLoading ? <Spinner size="sm" color="white" /> : "بله، حذف شود"}
            </Button>
            <Button color="default" onClick={closeDeleteModal}>
              انصراف
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit/Add Agency Modal */}
      <Modal
        isOpen={isEditModalOpen || isAddModalOpen}
        onClose={isEditModalOpen ? closeEditModal : closeAddModal}
        size="2xl"
      >
        <ModalContent>
          <ModalHeader>
            {isEditModalOpen ? "ویرایش آژانس" : "افزودن آژانس جدید"}
          </ModalHeader>
          <ModalBody>
            <AgencyForm
              agency={selectedAgency}
              onSuccess={() => {
                if (isEditModalOpen) {
                  closeEditModal();
                } else {
                  closeAddModal();
                }
                // Refresh the list after edit/add
                filterAgencies(searchTerm, statusFilter, cityFilter)
                  .then(setAgencies)
                  .catch(console.error);
              }}
              onCancel={isEditModalOpen ? closeEditModal : closeAddModal}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
