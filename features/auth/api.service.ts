import BaseService from "@/lib/api.service";

class authService extends BaseService {
  constructor() {
    super("auth");
  }

  async login(data: { email: string; password: string }) {
    return await this.post("login", data);
  }

  async forgotPassword(data: { email: string }) {
    return await this.post("forgot-password", data);
  }

  async resetPassword(data: {
    otp: string;
    password: string;
    password_confirmation: string;
  }) {
    return await this.post("reset-password", data);
  }

  async logout() {
    return await this.get("logout");
  }

  async verifyOtp(data: { email: string; otp: string }) {
    return await this.post("verify-otp", data);
  }

  async register(data: any) {
    return await this.post("register", data);
  }
}

export default new authService();
