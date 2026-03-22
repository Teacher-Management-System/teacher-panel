export interface TicketUser {
  id: string;
  name: string;
  email: string;
  mobile: string;
  country_code: string;
  status: string;
  created_at: number;
  updated_at: number;
}

export interface Ticket {
  id: string;
  ticket_number: number;
  user: TicketUser;
  subject: string;
  description: string;
  status: "pending" | "open" | "closed";
  priority: string;
  createdAt: number;
  updatedAt: number;
}
