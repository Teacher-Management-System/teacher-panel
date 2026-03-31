import BaseService from "@/lib/api.service";

class TicketService extends BaseService {
  constructor() {
    super("tickets");
  }

  public async getTickets(status?: string) {
    return this.get("", { status });
  }

  public async getMessages(ticketId: string, page: number = 1) {
    return this.get(`${ticketId}/messages?page=${page}`);
  }

  public async createTicket(subject: string, description: string) {
    return this.post("", { subject, description });
  }

  public async sendMessage(ticketId: string, body: string) {
    return this.post(`${ticketId}/messages`, { body, message: body });
  }
}

export const ticketService = new TicketService();
