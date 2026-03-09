import BaseService from "@/lib/api.service";

class BatchService extends BaseService {
  constructor() {
    super("batches");
  }

  async list(params?: any) {
    return await this.get("", params);
  }

  async create(data: any) {
    return await this.post("", data);
  }

  async update(id: number, data: any) {
    return await this.patch(id.toString(), data);
  }

  async updateStatus(id: number, data: { status: string }) {
    return await this.patch(`${id}/status`, data);
  }

  async deleteBatch(id: number) {
    return await this.delete(id.toString());
  }
}

const batchService = new BatchService();
export default batchService;
