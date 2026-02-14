declare module "@cashfreepayments/cashfree-js" {
  export interface CheckoutOptions {
    paymentSessionId: string;
    redirectTarget?: "_self" | "_blank" | "_modal";
    onSuccess?: (data: any) => void;
    onFailure?: (data: any) => void;
    onClose?: () => void;
  }

  export interface Cashfree {
    initialise(options: { mode: "sandbox" | "production" }): Promise<void>;
    checkout(options: CheckoutOptions): void;
  }

  export interface CashfreeConstructor {
    new (options?: any): Cashfree;
    (options?: any): Cashfree;
  }

  const cashfree: any;
  export default cashfree;

  export function load(options: any): Promise<Cashfree>;
}
