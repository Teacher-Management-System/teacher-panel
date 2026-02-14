export type UserStatus = "pending" | "inactive" | "active";

export interface User {
  id: number;
  name: string;
  email: string;
  status: UserStatus;
  mobile?: string;
  profile_picture?: string;
  role: string;
}
