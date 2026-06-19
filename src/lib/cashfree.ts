import { load, type Cashfree } from "@cashfreepayments/cashfree-js";

let cashfreeInstance: Cashfree | null = null;

export async function getCashfree(): Promise<Cashfree> {
  if (cashfreeInstance) {
    return cashfreeInstance;
  }

  cashfreeInstance = await load({
    mode: import.meta.env.VITE_CASHFREE_ENV === "production" ? "production" : "sandbox",
    
  });

  return cashfreeInstance;
}
