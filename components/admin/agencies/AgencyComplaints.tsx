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
  Textarea,
  useDisclosure,
} from "@heroui/react";
import {
  FaSearch,
  FaFilter,
  FaClipboardCheck,
  FaUserAlt,
  FaCalendarAlt,
  FaBuilding,
  FaInfoCircle,
} from "react-icons/fa";
import { Agency, Complaint } from "../data/agencies";
import { updateComplaintStatus } from "../data/agency-actions";

interface AgencyComplaintsProps {
  initialAgencies: Agency[];
}

export default function AgencyComplaints({
  initialAgencies,
}: AgencyComplaintsProps) {
  const [agencies, setAgencies] = useState<Agency[]>(initialAgencies);
  const [complaints, setComplaints] = useState<
    Array<Complaint & { agencyId: number; agencyName: string }>
  >(extractComplaints(initialAgencies));
  const [filteredComplaints, setFilteredComplaints] = useState(complaints);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "investigating" | "resolved" | "rejected"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [selectedComplaint, setSelectedComplaint] = useState<
    (Complaint & { agencyId: number; agencyName: string }) | null
  >(null);

  const {
    isOpen: isDetailsModalOpen,
    onOpen: openDetailsModal,
    onClose: closeDetailsModal,
  } = useDisclosure();
  const {
    isOpen: isStatusModalOpen,
    onOpen: openStatusModal,
    onClose: closeStatusModal,
  } = useDisclosure();

  const [newStatus, setNewStatus] = useState<
    "pending" | "investigating" | "resolved" | "rejected"
  >("pending");
  const [responseNote, setResponseNote] = useState("");

  // Extract complaints from agencies
  function extractComplaints(agencies: Agency[]) {
    const allComplaints: Array<
      Complaint & { agencyId: number; agencyName: string }
    > = [];

    agencies.forEach((agency) => {
      agency.complaints.forEach((complaint) => {
        allComplaints.push({
          ...complaint,
          agencyId: agency.id,
          agencyName: agency.name,
        });
      });
    });

    return allComplaints;
  }

  // Handle search and filtering
  const handleFilter = () => {
    setIsLoading(true);

    let filtered = [...complaints];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (complaint) =>
          complaint.userName.toLowerCase().includes(term) ||
          complaint.subject.toLowerCase().includes(term) ||
          complaint.description.toLowerCase().includes(term) ||
          complaint.agencyName.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (complaint) => complaint.status === statusFilter
      );
    }

    setFilteredComplaints(filtered);
    setCurrentPage(1);
    setIsLoading(false);
  };

  // Handle status change
  const handleStatusChange = async () => {
    if (!selectedComplaint) return;

    setIsLoading(true);

    try {
      await updateComplaintStatus(
        selectedComplaint.agencyId,
        selectedComplaint.id,
        newStatus
      );

      // Update local state
      const updatedComplaints = complaints.map((complaint) => {
        if (
          complaint.id === selectedComplaint.id &&
          complaint.agencyId === selectedComplaint.agencyId
        ) {
          return {
            ...complaint,
            status: newStatus,
          };
        }
        return complaint;
      });

      setComplaints(updatedComplaints);

      // Update filtered complaints
      const updatedFilteredComplaints = filteredComplaints.map((complaint) => {
        if (
          complaint.id === selectedComplaint.id &&
          complaint.agencyId === selectedComplaint.agencyId
        ) {
          return {
            ...complaint,
            status: newStatus,
          };
        }
        return complaint;
      });

      setFilteredComplaints(updatedFilteredComplaints);

      // Close modal
      closeStatusModal();

      // Reset form
      setResponseNote("");
    } catch (error) {
      console.error("Error updating complaint status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate pagination
  const pages = Math.ceil(filteredComplaints.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedComplaints = filteredComplaints.slice(startIndex, endIndex);

  // Status badge colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "warning";
      case "investigating":
        return "info";
      case "resolved":
        return "success";
      case "rejected":
        return "danger";
      default:
        return "default";
    }
  };

  // Status text
  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "در انتظار بررسی";
      case "investigating":
        return "در حال بررسی";
      case "resolved":
        return "حل شده";
      case "rejected":
        return "رد شده";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          placeholder="جستجو..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          startContent={<FaSearch className="text-gray-400" />}
        />

        <Select
          placeholder="وضعیت"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          startContent={<FaFilter className="text-gray-400" />}
        >
          <SelectItem value="all">همه</SelectItem>
          <SelectItem value="pending">در انتظار بررسی</SelectItem>
          <SelectItem value="investigating">در حال بررسی</SelectItem>
          <SelectItem value="resolved">حل شده</SelectItem>
          <SelectItem value="rejected">رد شده</SelectItem>
        </Select>

        <Button color="primary" onClick={handleFilter}>
          اعمال فیلتر
        </Button>
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-lg overflow-hidden">
        <Table
          aria-label="جدول شکایات آژانس‌ها"
          classNames={{
            base: "min-h-[400px]",
            table: "min-w-full",
          }}
        >
          <TableHeader>
            <TableColumn width={60} className="text-right">
              ردیف
            </TableColumn>
            <TableColumn className="text-right">موضوع</TableColumn>
            <TableColumn className="text-right">نام کاربر</TableColumn>
            <TableColumn className="text-right">آژانس</TableColumn>
            <TableColumn className="text-right">تاریخ</TableColumn>
            <TableColumn className="text-right">وضعیت</TableColumn>
            <TableColumn className="text-right">عملیات</TableColumn>
          </TableHeader>

          <TableBody
            isLoading={isLoading}
            loadingContent={<Spinner color="primary" />}
            emptyContent="هیچ شکایتی یافت نشد"
          >
            {paginatedComplaints.map((complaint, index) => (
              <TableRow key={`${complaint.agencyId}-${complaint.id}`}>
                <TableCell>{startIndex + index + 1}</TableCell>
                <TableCell>
                  <div className="font-medium">{complaint.subject}</div>
                </TableCell>
                <TableCell>{complaint.userName}</TableCell>
                <TableCell>{complaint.agencyName}</TableCell>
                <TableCell dir="ltr" className="text-right">
                  {complaint.date}
                </TableCell>
                <TableCell>
                  <Chip
                    color={getStatusColor(complaint.status)}
                    variant="flat"
                    size="sm"
                  >
                    {getStatusText(complaint.status)}
                  </Chip>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2 space-x-reverse">
                    <Button
                      size="sm"
                      variant="light"
                      color="primary"
                      onClick={() => {
                        setSelectedComplaint(complaint);
                        openDetailsModal();
                      }}
                    >
                      <FaInfoCircle />
                    </Button>
                    <Button
                      size="sm"
                      variant="light"
                      color="success"
                      onClick={() => {
                        setSelectedComplaint(complaint);
                        setNewStatus(complaint.status);
                        openStatusModal();
                      }}
                    >
                      <FaClipboardCheck />
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
            نمایش {startIndex + 1} تا{" "}
            {Math.min(endIndex, filteredComplaints.length)} از{" "}
            {filteredComplaints.length} شکایت
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

      {/* Complaint Details Modal */}
      <Modal isOpen={isDetailsModalOpen} onClose={closeDetailsModal} size="lg">
        <ModalContent>
          {selectedComplaint && (
            <>
              <ModalHeader className="flex justify-between items-center">
                <div>جزئیات شکایت</div>
                <Chip
                  color={getStatusColor(selectedComplaint.status)}
                  variant="flat"
                >
                  {getStatusText(selectedComplaint.status)}
                </Chip>
              </ModalHeader>

              <ModalBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-start gap-2">
                    <FaUserAlt className="text-gray-500 mt-1" />
                    <div>
                      <div className="text-sm text-gray-600">نام کاربر</div>
                      <div className="font-medium">
                        {selectedComplaint.userName}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <FaCalendarAlt className="text-gray-500 mt-1" />
                    <div>
                      <div className="text-sm text-gray-600">تاریخ</div>
                      <div className="font-medium" dir="ltr">
                        {selectedComplaint.date}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <FaBuilding className="text-gray-500 mt-1" />
                    <div>
                      <div className="text-sm text-gray-600">آژانس</div>
                      <div className="font-medium">
                        {selectedComplaint.agencyName}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-1">موضوع</div>
                  <div className="font-medium">{selectedComplaint.subject}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-1">توضیحات</div>
                  <div className="p-3 bg-gray-50 rounded-md">
                    {selectedComplaint.description}
                  </div>
                </div>
              </ModalBody>

              <ModalFooter>
                <Button
                  color="primary"
                  onClick={() => {
                    closeDetailsModal();
                    setNewStatus(selectedComplaint.status);
                    openStatusModal();
                  }}
                >
                  تغییر وضعیت
                </Button>
                <Button color="default" onClick={closeDetailsModal}>
                  بستن
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Status Change Modal */}
      <Modal isOpen={isStatusModalOpen} onClose={closeStatusModal} size="md">
        <ModalContent>
          {selectedComplaint && (
            <>
              <ModalHeader>تغییر وضعیت شکایت</ModalHeader>

              <ModalBody>
                <div className="space-y-4">
                  <div>
                    <div className="font-medium">
                      {selectedComplaint.subject}
                    </div>
                    <div className="text-sm text-gray-600">
                      از {selectedComplaint.userName} برای آژانس{" "}
                      {selectedComplaint.agencyName}
                    </div>
                  </div>

                  <Select
                    label="وضعیت جدید"
                    selectedKeys={[newStatus]}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    isRequired
                  >
                    <SelectItem value="pending">در انتظار بررسی</SelectItem>
                    <SelectItem value="investigating">در حال بررسی</SelectItem>
                    <SelectItem value="resolved">حل شده</SelectItem>
                    <SelectItem value="rejected">رد شده</SelectItem>
                  </Select>

                  <Textarea
                    label="یادداشت پاسخ (اختیاری)"
                    placeholder="توضیحات تکمیلی در مورد تغییر وضعیت..."
                    value={responseNote}
                    onChange={(e) => setResponseNote(e.target.value)}
                    minRows={3}
                  />
                </div>
              </ModalBody>

              <ModalFooter>
                <Button
                  color="primary"
                  onClick={handleStatusChange}
                  isLoading={isLoading}
                  isDisabled={isLoading}
                >
                  ثبت تغییرات
                </Button>
                <Button color="default" onClick={closeStatusModal}>
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
