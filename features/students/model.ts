import { Batch } from "../batches/model";

export interface Student {
  id: string;
  name: string;
  email: string;
  mobile: string;
  status: "active" | "inactive" | "pending" | "complete" | "completed";
  fathers_name?: string;
  category_id?: string;
  course_id?: string;
  category?: {
    id: string;
    name: string;
    slug?: string;
  };
  course?: {
    id: string;
    title: string;
    name?: string;
    slug?: string;
  };
  created_at?: string;
  dob?: string;
  gender?: "male" | "female" | "other";
  school_name?: string;
  class?: string;
  batch?: Batch;
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
