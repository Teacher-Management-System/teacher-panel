export interface NotificationItem {
  id: string;
  type: "error" | "info" | "success" | "warning";
  title: string;
  description: string;
  attachment: string | null;
  scheduled_at: string;
  send_at: string;
  status: string;
  is_read: boolean | null;
  created_at: string;
}

export interface NotificationMeta {
  total_page: number;
  current_page: number;
  total_item: number;
  per_page: number;
}

export interface NotificationLink {
  next: boolean;
  prev: boolean;
}

export interface NotificationResponse {
  notifications: NotificationItem[];
  meta: NotificationMeta;
}
