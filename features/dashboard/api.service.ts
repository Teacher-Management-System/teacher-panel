import BaseService from "@/lib/api.service";

import { DashboardResponse } from "./model";

export class DashboardService extends BaseService {
  constructor() {
    super("dashboard");
  }

  getDashboardData(params?: any): Promise<DashboardResponse | undefined> {
    return this.get("", params) as Promise<DashboardResponse | undefined>;
  }

  getStats(params?: any) {
    return this.get("stats", params);
  }

  getUserStats(params?: any) {
    return this.get("users", params);
  }

  getCheckInStats(params?: any) {
    return this.get("check-ins", params);
  }

  getPostStats(params?: any) {
    return this.get("posts-vs-reviews", params);
  }

  getVendorStats(params?: any) {
    return this.get("vendors", params);
  }

  getTopStats(params?: any) {
    return this.get("top-stats", params);
  }

  getTopAllTimeStats(params?: any) {
    return this.get("top-all-time-stats", params);
  }
}

const dashboardServiceInstance = new DashboardService();

export default dashboardServiceInstance;
