import { Student } from "@/features/students/model";
import { User } from "./user";

export interface Data {
  user?: User;
  meta?: Meta;

  reports?: any[];

  students?: Student[];
  total_students?: number;
  active_students?: number;
  pending_students?: number;
  completed_students?: number;

  payment_session_id?: string;
  order_id?: string;
  is_free?: boolean;
}

export interface Meta {
  total_page: number;
  total_item: number;
  current_page: number;
  per_page: number;
}
