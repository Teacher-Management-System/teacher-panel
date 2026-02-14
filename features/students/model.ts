export interface Student {
  id: string;
  name: string;
  email: string;
  mobile: string;
  status: "active" | "inactive" | "pending";
  fathers_name: string;
  created_at?: string;
  dob?: string;
  gender?: "male" | "female" | "other";
  school_name?: string;
  class?: string;
  level?: "1" | "2";
}

export interface PaymentStatusResponse {
  order_id: string;
  payment_status: string;
  payment_id: string;
  payment_amount: string;
  payment_currency: string;
  payment_method: string;
  payment_time: string;
  payment_status_code: string;
  payment_status_message: string;
}
