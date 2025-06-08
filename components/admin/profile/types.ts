export interface LoginInfo {
  ip: string;
  device: string;
}

export interface ActiveSession {
  sessionId: string;
  device: string;
  ip: string;
  loginTime: string;
  lastActivity: string;
  _id: string;
  id: string;
}

export interface LoginHistoryItem {
  ip: string;
  device: string;
  lastLogin: string;
  _id: string;
  id: string;
}

export interface UserProfile {
  lastLoginInfo: LoginInfo;
  _id: string;
  phone: string;
  countryCode: string;
  roles: string[];
  adQuota: number;
  isActive: boolean;
  isBanned: boolean;
  isProfileComplete: boolean;
  devices: any[];
  isDeleted: boolean;
  isPhoneShow: boolean;
  isEmailShow: boolean;
  activeSessions: ActiveSession[];
  loginHistory: LoginHistoryItem[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  birthDate?: string;
  email?: string;
  firstName?: string;
  gender?: string;
  icon?: string | null;
  lastName?: string;
  nationalCode?: string;
  agency?: string;
  id: string;
}

export interface ProfileApiResponse {
  data: UserProfile;
  status: number;
  success: boolean;
}
