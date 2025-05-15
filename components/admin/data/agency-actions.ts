"use server";

import agencies, { Agency, Review, Complaint, Staff } from "./agencies";

// Get all agencies
export async function getAgencies(): Promise<Agency[]> {
  return agencies;
}

// Get agency by ID
export async function getAgencyById(id: number): Promise<Agency | null> {
  const agency = agencies.find((a) => a.id === id);
  return agency || null;
}

// Filter agencies by search term, status, and city
export async function filterAgencies(
  searchTerm: string = "",
  status: "all" | "active" | "pending" | "suspended" = "all",
  city: string = ""
): Promise<Agency[]> {
  let filtered = agencies;

  if (status !== "all") {
    filtered = filtered.filter((agency) => agency.status === status);
  }

  if (city) {
    filtered = filtered.filter((agency) => agency.city === city);
  }

  if (searchTerm) {
    const searchLower = searchTerm.toLowerCase();
    filtered = filtered.filter(
      (agency) =>
        agency.name.toLowerCase().includes(searchLower) ||
        agency.email.toLowerCase().includes(searchLower) ||
        agency.phone.includes(searchTerm) ||
        agency.address.toLowerCase().includes(searchLower)
    );
  }

  return filtered;
}

// Update agency
export async function updateAgency(agencyData: Agency): Promise<Agency> {
  const index = agencies.findIndex((a) => a.id === agencyData.id);

  if (index !== -1) {
    agencies[index] = agencyData;
    return agencyData;
  }

  throw new Error("Agency not found");
}

// Add new agency
export async function addAgency(
  agencyData: Omit<Agency, "id">
): Promise<Agency> {
  const newAgency: Agency = {
    ...agencyData,
    id: Math.max(...agencies.map((a) => a.id), 0) + 1,
  };

  agencies.push(newAgency);
  return newAgency;
}

// Delete agency
export async function deleteAgency(id: number): Promise<boolean> {
  const index = agencies.findIndex((a) => a.id === id);

  if (index !== -1) {
    agencies.splice(index, 1);
    return true;
  }

  return false;
}

// Add review to agency
export async function addReview(
  agencyId: number,
  review: Omit<Review, "id">
): Promise<Review> {
  const agency = agencies.find((a) => a.id === agencyId);

  if (!agency) {
    throw new Error("Agency not found");
  }

  const newReview: Review = {
    ...review,
    id: Math.max(...agency.reviews.map((r) => r.id), 0) + 1,
  };

  agency.reviews.push(newReview);

  // Update agency rating
  const totalRating = agency.reviews.reduce((sum, r) => sum + r.rating, 0);
  agency.rating = parseFloat((totalRating / agency.reviews.length).toFixed(1));
  agency.reviewsCount = agency.reviews.length;

  return newReview;
}

// Add complaint to agency
export async function addComplaint(
  agencyId: number,
  complaint: Omit<Complaint, "id">
): Promise<Complaint> {
  const agency = agencies.find((a) => a.id === agencyId);

  if (!agency) {
    throw new Error("Agency not found");
  }

  const newComplaint: Complaint = {
    ...complaint,
    id: Math.max(...agency.complaints.map((c) => c.id || 0), 0) + 1,
  };

  agency.complaints.push(newComplaint);
  return newComplaint;
}

// Update complaint status
export async function updateComplaintStatus(
  agencyId: number,
  complaintId: number,
  status: "pending" | "investigating" | "resolved" | "rejected"
): Promise<Complaint> {
  const agency = agencies.find((a) => a.id === agencyId);

  if (!agency) {
    throw new Error("Agency not found");
  }

  const complaint = agency.complaints.find((c) => c.id === complaintId);

  if (!complaint) {
    throw new Error("Complaint not found");
  }

  complaint.status = status;
  return complaint;
}

// Add staff member to agency
export async function addStaffMember(
  agencyId: number,
  staff: Omit<Staff, "id">
): Promise<Staff> {
  const agency = agencies.find((a) => a.id === agencyId);

  if (!agency) {
    throw new Error("Agency not found");
  }

  const newStaff: Staff = {
    ...staff,
    id: Math.max(...agency.staff.map((s) => s.id), 0) + 1,
  };

  agency.staff.push(newStaff);
  return newStaff;
}

// Update staff member
export async function updateStaffMember(
  agencyId: number,
  staffData: Staff
): Promise<Staff> {
  const agency = agencies.find((a) => a.id === agencyId);

  if (!agency) {
    throw new Error("Agency not found");
  }

  const index = agency.staff.findIndex((s) => s.id === staffData.id);

  if (index !== -1) {
    agency.staff[index] = staffData;
    return staffData;
  }

  throw new Error("Staff member not found");
}

// Remove staff member
export async function removeStaffMember(
  agencyId: number,
  staffId: number
): Promise<boolean> {
  const agency = agencies.find((a) => a.id === agencyId);

  if (!agency) {
    throw new Error("Agency not found");
  }

  const index = agency.staff.findIndex((s) => s.id === staffId);

  if (index !== -1) {
    agency.staff.splice(index, 1);
    return true;
  }

  return false;
}

// Get unique cities
export async function getUniqueCities(): Promise<string[]> {
  const cities = new Set(agencies.map((a) => a.city));
  return Array.from(cities);
}
