export interface Batch {
  id: string;
  teacher?: {
    teacher_id: string;
    name: string;
  };
  name: string;
  location: string;
  start_date: string;
  status: "active" | "inactive" | "pending" | "completed";
  created_at: string;
}
