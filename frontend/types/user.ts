export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  badgeNumber: string;
  status: "Online" | "Offline" | "In Field";
  organization: string;
  region: string;
  avatarUrl?: string;
}
