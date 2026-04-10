import BaseService from "@/lib/api.service";

class InquiryService extends BaseService {
  constructor() {
    super("inquiry");
  }

  async store(data: {
    name: string;
    email: string;
    mobile: string;
    text: string;
  }) {
    return await this.post("", data);
  }
}

const inquiryService = new InquiryService();
export default inquiryService;
