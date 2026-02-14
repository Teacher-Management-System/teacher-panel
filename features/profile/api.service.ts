import BaseService from "@/lib/api.service";
import { PaymentSession } from "@/features/profile/model";

class ProfileService extends BaseService {
  constructor() {
    super("/users");
  }

  async getProfile() {
    return await this.get("/me");
  }

  async getAddress() {
    return await this.get("/address");
  }

  async updateAddress(data: any) {
    return await this.post("/address", data);
  }

  async updateProfile(data: any) {
    return await this.post("/update", data);
  }

  async changePassword(data: any) {
    return await this.post("/change-password", data);
  }

  async initiatePayment() {
    return (await this.post("payment", {})) as unknown as PaymentSession;
  }

  async verifyPaymentStatus() {
    return await this.get("/payment-status");
  }
}

const profileServiceInstance = new ProfileService();

export default profileServiceInstance;
