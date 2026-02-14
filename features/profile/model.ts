export interface Profile {
  id: number;
  name: string;
  email: string;
  mobile: string;
  status: "pending" | "inactive" | "active";
  address?: Address;
  aadhar?: Aadhar;
}

export interface Address {
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
}

export interface Aadhar {
  front: string;
  back: string;
}

export interface PaymentSession {
  payment_session_id: string;
  order_id: string;
  order_amount: string;
  order_currency: string;
  order_status: string;
  order_meta: {
    return_url: string;
  };
}
