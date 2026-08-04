export type Role = "USER" | "ADMIN";
export type Status = "ACTIVE" | "SUSPENDED" | "DISABLED" | "DELETED";
export const ROLE_PERMISSIONS: Record<Role, string[]> = {
  USER: ["profile:read", "sessions:manage"],
  ADMIN: ["profile:read", "sessions:manage", "admin:read", "admin:write", "users:manage"],
};
export type AuthUser = {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string | null;
  avatarUrl: string | null;
  role: Role;
  status: Status;
  provider: "GOOGLE";
  permissions: string[];
};
