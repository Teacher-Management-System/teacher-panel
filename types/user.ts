export type UserStatus = "pending" | "inactive" | "active";

export interface User {
  id: number | string;
  teacher_id?: string;
  name: string;
  email: string;
  status: UserStatus;
  mobile?: string;
  avatar?: string;
  profile_picture?: string;
  role: string;
  is_profile_completed?: boolean;
  is_basic?: boolean;
  is_address?: boolean;
  is_document?: boolean;

  // Profile details
  father_name?: string | null;
  gender?: string | null;
  dob?: string | number | null;
  qualification_level?: string | null;
  current_status?: string | null;
  college_name?: string | null;
  course?: string | null;
  year?: string | number | null;
  organization_name?: string | null;
  designation?: string | null;
  monthly_payment_expectation?: string | number | null;

  address?: {
    address_line1: string | null;
    address_line2: string | null;
    city: string | null;
    state: string | null;
    pincode: string | null;
    country: string | null;
  };
  documents?: any[];
  aadhar?: {
    front: string | null;
    back: string | null;
  };
  user?: any;
}
