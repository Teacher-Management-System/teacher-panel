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
