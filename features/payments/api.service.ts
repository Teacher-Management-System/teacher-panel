import BaseService from "@/lib/api.service";
import apiClient from "@/lib/axios";

class PaymentService extends BaseService {
  constructor() {
    super("payments");
  }

  async list(params: any) {
    const response = await apiClient.get(this.buildUrl(), { params });
    return response;
  }

  private buildUrl(path: string = ""): string {
    return ["payments", path].filter(Boolean).join("/");
  }
}

const paymentService = new PaymentService();

export default paymentService;
