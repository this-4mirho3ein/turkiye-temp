import React, { useState } from "react";
import {
  FiSearch,
  FiX,
  FiPlus,
  FiMail,
  FiUser,
  FiMoreVertical,
  FiChevronUp,
  FiChevronDown,
  FiTrash2,
} from "react-icons/fi";
import { sendInvitation } from "@/controllers/makeRequest";
import { useAuth } from "@/context/AuthContext";

// Types for team members and invitations
interface TeamMember {
  id: string;
  name: string;
  role: string;
  phoneNumber: string;
}

interface Invitation {
  id?: string;
  phoneNumber: string;
  role: string;
  status: "pending" | "accepted" | "expired";
}

interface AgencyTeamProps {
  userData?: any;
}

export default function AgencyTeam({ userData }: AgencyTeamProps) {
  const { state } = useAuth();

  // Mock data for team members
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "علی محمدی",
      role: "مدیر منطقه",
      phoneNumber: "09123456789",
    },
    {
      id: "2",
      name: "سارا احمدی",
      role: "مشاور املاک",
      phoneNumber: "09123456788",
    },
    {
      id: "3",
      name: "رضا کریمی",
      role: "مشاور املاک",
      phoneNumber: "09123456787",
    },
  ]);

  // Mock data for invitations
  const [invitations, setInvitations] = useState<Invitation[]>([
    {
      id: "1",
      phoneNumber: "09123456786",
      role: "مشاور املاک",
      status: "pending",
    },
    {
      id: "2",
      phoneNumber: "09123456785",
      role: "مدیر منطقه",
      status: "accepted",
    },
    {
      id: "3",
      phoneNumber: "09123456784",
      role: "مشاور املاک",
      status: "expired",
    },
  ]);

  // State for invitation modal
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [newInvite, setNewInvite] = useState({
    phoneNumber: "",
    role: "مشاور املاک",
  });
  const [inviteMessage, setInviteMessage] = useState<string | null>(null);
  const [inviteStatus, setInviteStatus] = useState<"success" | "error" | null>(
    null
  );

  // State for active tab
  const [activeTab, setActiveTab] = useState<"members" | "invitations">(
    "members"
  );

  // State for search
  const [searchQuery, setSearchQuery] = useState("");

  // Define possible roles (ordered by rank)
  const roles = ["مشاور املاک", "مدیر منطقه", "مدیر ارشد"];

  // State for active dropdown menu
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // State to track dropdown position
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  // Function to filter team members based on search query
  const filteredTeamMembers = teamMembers.filter(
    (member) =>
      member.name.includes(searchQuery) ||
      member.phoneNumber.includes(searchQuery)
  );

  // Function to filter invitations based on search query
  const filteredInvitations = invitations.filter((invite) =>
    invite.phoneNumber.includes(searchQuery)
  );

  // Function to handle invitation submission
  const handleInviteSubmit = () => {
    if (!newInvite.phoneNumber) return;

    // Reset previous message
    setInviteMessage(null);
    setInviteStatus(null);

    // Format phone number - remove leading zero if present
    let formattedPhone = newInvite.phoneNumber;
    if (formattedPhone.startsWith("0")) {
      formattedPhone = formattedPhone.substring(1);
    }

    // Call sendInvitation function from makeRequest.ts with user token
    sendInvitation(state.accessToken, formattedPhone, newInvite.role)
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          // Add the new invitation to the local state
          const newInvitation: Invitation = {
            id: Date.now().toString(),
            phoneNumber: newInvite.phoneNumber,
            role: newInvite.role,
            status: "pending",
          };

          setInvitations([newInvitation, ...invitations]);

          // Display success message if available
          if (response.message) {
            setInviteMessage(response.message);
            setInviteStatus("success");
          } else {
            // Close modal if no message to display
            setNewInvite({ phoneNumber: "", role: "مشاور املاک" });
            setShowInviteModal(false);
          }
        }
      })
      .catch((error) => {
        console.error("Failed to send invitation:", error);
        // Display error message
        if (error.response?.data?.message) {
          setInviteMessage(error.response.data.message);
        } else {
          setInviteMessage("خطا در ارسال دعوت‌نامه");
        }
        setInviteStatus("error");
      });
  };

  // Function to promote a team member
  const handlePromote = (memberId: string) => {
    setTeamMembers(
      teamMembers.map((member) => {
        if (member.id === memberId) {
          const currentRoleIndex = roles.indexOf(member.role);
          // Check if member can be promoted further
          if (currentRoleIndex < roles.length - 1) {
            return { ...member, role: roles[currentRoleIndex + 1] };
          }
        }
        return member;
      })
    );
    setActiveDropdown(null);
  };

  // Function to demote a team member
  const handleDemote = (memberId: string) => {
    setTeamMembers(
      teamMembers.map((member) => {
        if (member.id === memberId) {
          const currentRoleIndex = roles.indexOf(member.role);
          // Check if member can be demoted further
          if (currentRoleIndex > 0) {
            return { ...member, role: roles[currentRoleIndex - 1] };
          }
        }
        return member;
      })
    );
    setActiveDropdown(null);
  };

  // Function to remove a team member
  const handleRemove = (memberId: string) => {
    setTeamMembers(teamMembers.filter((member) => member.id !== memberId));
    setActiveDropdown(null);
  };

  // Function to toggle dropdown menu visibility
  const toggleDropdown = (memberId: string, event?: React.MouseEvent) => {
    if (activeDropdown === memberId) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(memberId);

      // If we have the event, set the position based on the clicked button
      if (event) {
        const rect = (
          event.currentTarget as HTMLElement
        ).getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
        });
      }
    }
  };

  return (
    <div className="bg-white rounded-lg border my-4 border-gray-200 p-4">
      <div className="flex justify-between items-center border-b pb-4">
        <h3 className="text-lg font-medium">مدیریت تیم</h3>
        <button
          onClick={() => setShowInviteModal(true)}
          className="px-3 py-2 bg-primary text-white rounded-md flex items-center gap-2 text-sm"
        >
          <FiPlus size={16} />
          دعوت همکار جدید
        </button>
      </div>

      {/* Search and Tabs */}
      <div className="flex justify-between items-center mt-4 mb-4">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="جستجو..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
        </div>

        <div className="flex gap-2 border-b">
          <button
            onClick={() => setActiveTab("members")}
            className={`px-4 py-2 ${
              activeTab === "members"
                ? "border-b-2 border-primary text-primary"
                : "text-gray-500"
            }`}
          >
            اعضای تیم
          </button>
          <button
            onClick={() => setActiveTab("invitations")}
            className={`px-4 py-2 ${
              activeTab === "invitations"
                ? "border-b-2 border-primary text-primary"
                : "text-gray-500"
            }`}
          >
            دعوت‌نامه‌ها
          </button>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === "members" ? (
        <>
          {/* Desktop Table View (hidden on mobile) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-xs font-medium text-gray-500 text-center"
                  >
                    نام و نام خانوادگی
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-xs font-medium text-gray-500 text-center"
                  >
                    نقش
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-xs font-medium text-gray-500 text-center"
                  >
                    شماره تماس
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-xs font-medium text-gray-500 text-center"
                  >
                    عملیات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTeamMembers.length > 0 ? (
                  filteredTeamMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center">
                          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary ml-2">
                            <FiUser size={16} className="" />
                          </div>
                          <span>{member.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          {member.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        {member.phoneNumber}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <div className="relative">
                          <button
                            onClick={(e) => toggleDropdown(member.id, e)}
                            className="p-1 rounded-full hover:bg-gray-100"
                          >
                            <FiMoreVertical size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      هیچ عضوی یافت نشد
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View (shown only on mobile) */}
          <div className="md:hidden space-y-4">
            {filteredTeamMembers.length > 0 ? (
              filteredTeamMembers.map((member) => (
                <div
                  key={member.id}
                  className="bg-white p-4 rounded-lg shadow border border-gray-100"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary ml-3">
                        <FiUser size={20} />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">{member.name}</h3>
                        <div className="flex items-center space-x-2 space-x-reverse mt-1">
                          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                            {member.role}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="relative">
                      <button
                        onClick={(e) => toggleDropdown(member.id, e)}
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <FiMoreVertical size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">شماره تماس:</span>
                        <span className="block">{member.phoneNumber}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 bg-white rounded-lg shadow-sm border border-gray-200">
                هیچ عضوی یافت نشد
              </div>
            )}
          </div>

          {/* Dropdown menu container - placed outside normal flow */}
          {activeDropdown && (
            <div className="fixed inset-0 z-50 pointer-events-none">
              <div
                className="absolute pointer-events-auto"
                style={{
                  top: `${dropdownPosition.top}px`,
                  left: `${dropdownPosition.left}px`,
                }}
              >
                <div className="mt-1 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1" role="menu">
                    {filteredTeamMembers.map(
                      (member) =>
                        member.id === activeDropdown && (
                          <React.Fragment key={member.id}>
                            {roles.indexOf(member.role) < roles.length - 1 && (
                              <button
                                onClick={() => handlePromote(member.id)}
                                className="flex items-center w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                role="menuitem"
                              >
                                <FiChevronUp className="ml-2 text-green-600" />
                                ارتقاء
                              </button>
                            )}
                            {roles.indexOf(member.role) > 0 && (
                              <button
                                onClick={() => handleDemote(member.id)}
                                className="flex items-center w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                role="menuitem"
                              >
                                <FiChevronDown className="ml-2 text-yellow-600" />
                                تنزل
                              </button>
                            )}
                            <button
                              onClick={() => handleRemove(member.id)}
                              className="flex items-center w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              role="menuitem"
                            >
                              <FiTrash2 className="ml-2 text-red-600" />
                              حذف
                            </button>
                          </React.Fragment>
                        )
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Desktop Table View (hidden on mobile) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-xs font-medium text-gray-500 text-center"
                  >
                    شماره تماس
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-xs font-medium text-gray-500 text-center"
                  >
                    نقش
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-xs font-medium text-gray-500 text-center"
                  >
                    وضعیت
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-xs font-medium text-gray-500 text-center"
                  >
                    عملیات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInvitations.length > 0 ? (
                  filteredInvitations.map((invite) => (
                    <tr key={invite.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        {invite.phoneNumber}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          {invite.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            invite.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : invite.status === "accepted"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {invite.status === "pending"
                            ? "در انتظار"
                            : invite.status === "accepted"
                            ? "پذیرفته شده"
                            : "منقضی شده"}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-500">
                        {invite.status === "pending" && (
                          <>
                            <button
                              className="px-2 py-1 text-xs text-indigo-600 hover:text-indigo-900"
                              onClick={() => {
                                // Logic to resend invitation
                                const updatedInvitations = [...invitations];
                                setInvitations(updatedInvitations);
                              }}
                            >
                              ارسال مجدد
                            </button>
                            <button
                              className="px-2 py-1 text-xs text-red-600 hover:text-red-900 mr-2"
                              onClick={() => {
                                // Logic to cancel invitation
                                setInvitations(
                                  invitations.filter((i) => i.id !== invite.id)
                                );
                              }}
                            >
                              لغو
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      هیچ دعوت‌نامه‌ای یافت نشد
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View (shown only on mobile) */}
          <div className="md:hidden space-y-4">
            {filteredInvitations.length > 0 ? (
              filteredInvitations.map((invite) => (
                <div
                  key={invite.id}
                  className="bg-white p-4 rounded-lg shadow border border-gray-100"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center mb-2">
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary ml-2">
                          <FiMail size={16} />
                        </div>
                        <span dir="ltr" className="text-lg">
                          {invite.phoneNumber}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          {invite.role}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            invite.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : invite.status === "accepted"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {invite.status === "pending"
                            ? "در انتظار"
                            : invite.status === "accepted"
                            ? "پذیرفته شده"
                            : "منقضی شده"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end gap-2">
                    {invite.status === "pending" && (
                      <>
                        <button
                          className="px-3 py-1.5 text-xs bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200"
                          onClick={() => {
                            // Logic to resend invitation
                            const updatedInvitations = [...invitations];
                            setInvitations(updatedInvitations);
                          }}
                        >
                          ارسال مجدد
                        </button>
                        <button
                          className="px-3 py-1.5 text-xs bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                          onClick={() => {
                            // Logic to cancel invitation
                            setInvitations(
                              invitations.filter((i) => i.id !== invite.id)
                            );
                          }}
                        >
                          لغو
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 bg-white rounded-lg shadow-sm border border-gray-200">
                هیچ دعوت‌نامه‌ای یافت نشد
              </div>
            )}
          </div>
        </>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-medium">دعوت همکار جدید</h3>
              <button
                onClick={() => {
                  setShowInviteModal(false);
                  setInviteMessage(null);
                  setInviteStatus(null);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <FiX size={20} />
              </button>
            </div>
            <div className="p-4">
              {inviteMessage && (
                <div
                  className={`mb-4 p-3 rounded-md ${
                    inviteStatus === "success"
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {inviteMessage}
                </div>
              )}
              <div className="mb-4">
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  شماره موبایل
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  placeholder="مثال: 09123456789"
                  value={newInvite.phoneNumber}
                  onChange={(e) =>
                    setNewInvite({ ...newInvite, phoneNumber: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  نقش
                </label>
                <select
                  id="role"
                  value={newInvite.role}
                  onChange={(e) =>
                    setNewInvite({ ...newInvite, role: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="مشاور املاک">مشاور املاک</option>
                  <option value="مدیر منطقه">مدیر منطقه</option>
                </select>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md ml-2 hover:bg-gray-50"
                >
                  انصراف
                </button>
                <button
                  onClick={handleInviteSubmit}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark flex items-center gap-2"
                >
                  <FiMail size={16} />
                  ارسال دعوت‌نامه
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
