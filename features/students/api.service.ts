import BaseService from "@/lib/api.service";

class StudentService extends BaseService {
  constructor() {
    super("students");
  }

  async list(params: any) {
    return await this.get("", params);
  }

  async create(data: any) {
    return await this.post("", data);
  }

  async update(id: string, data: any) {
    return await this.put(id, data);
  }

  async deleteStudent(id: string) {
    return await this.delete(id);
  }

  async getBatches() {
    return await this.get("batches");
  }

  async getFormUrl() {
    return await this.get("form-url");
  }

  async sendOtp(data: { email: string; event: string }) {
    return await this.post("send-otp", data);
  }

  async verifyOtp(data: {
    verification_id: string;
    otp: string;
    email: string;
  }) {
    return await this.post("verify-otp", data);
  }

  async processPayment(studentIds: string[]) {
    return await this.post("payments", { student_id: studentIds });
  }

  async verifyPaymentStatus(orderId: string) {
    return await this.get(`payment-status/${orderId}`);
  }

  async exportData() {
    return await this.download("export");
  }
}

const studentService = new StudentService();

export default studentService;
