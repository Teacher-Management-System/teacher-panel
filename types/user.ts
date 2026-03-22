export type UserStatus = "pending" | "inactive" | "active";

export interface User {
  id: number;
  teacher_id?: string;
  name: string;
  email: string;
  status: UserStatus;
  mobile?: string;
  profile_picture?: string;
  role: string;
  is_completed?: boolean;
  aadhar?: {
    front: string;
    back: string;
  };
}
