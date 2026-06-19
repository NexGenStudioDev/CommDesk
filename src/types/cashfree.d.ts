declare module "@cashfreepayments/cashfree-js" {
  export interface CashfreeCheckoutOptions {
    paymentSessionId: string;
    redirectTarget?: "_modal" | "_self" | "_blank";
  }

  export interface CashfreeCheckoutResult {
    error?: {
      code?: string;
      message?: string;
    };
    redirect?: boolean;
    paymentDetails?: {
      paymentMessage?: string;
      paymentStatus?: string;
      paymentAmount?: number;
      paymentMethod?: string;
    };
  }

  export interface Cashfree {
    checkout(options: CashfreeCheckoutOptions): Promise<CashfreeCheckoutResult>;
  }

  export interface LoadOptions {
    mode: "sandbox" | "production";
  }

  export function load(options: LoadOptions): Promise<Cashfree>;
}
