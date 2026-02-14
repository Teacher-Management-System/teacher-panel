import BaseService from "@/lib/api.service";
import { NotificationResponse } from "./model";

export class NotificationService extends BaseService {
  constructor() {
    super("notifications");
  }

  getNotifications(params?: any): Promise<NotificationResponse | undefined> {
    return this.get("", params) as Promise<NotificationResponse | undefined>;
  }

  markAsRead(id?: string): Promise<any> {
    const url = id ? `${id}/read` : "read-all";
    return this.patch(url, {});
  }
}

const notificationService = new NotificationService();
export default notificationService;
