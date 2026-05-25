/**
 * Production-grade security utilities for CommDesk Billing
 */

/**
 * Verifies a webhook payload against an HMAC-SHA256 signature and a shared secret.
 * Utilizes standard Web Crypto API (supported natively in all modern browsers and Tauri).
 */
export async function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): Promise<boolean> {
  if (!payload || !signature || !secret) return false;
  try {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    
    // Import HMAC Key
    const key = await window.crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign", "verify"]
    );

    // Convert hex signature string back to a Uint8Array
    const hexParts = signature.match(/.{1,2}/g);
    if (!hexParts) return false;
    const signatureBytes = new Uint8Array(hexParts.map((byte) => parseInt(byte, 16)));
    
    const payloadData = encoder.encode(payload);

    // Cryptographically verify signature
    return await window.crypto.subtle.verify("HMAC", key, signatureBytes, payloadData);
  } catch (error) {
    console.error("Signature verification error:", error);
    return false;
  }
}

/**
 * Evaluates payment transaction payloads for security threats and generates a fraud score.
 * Flagged transactions (score >= 50) indicate high risk of payment fraud or abuse.
 */
export function calculateFraudScore(payload: {
  amountRupees?: number;
  paymentMethod?: string;
  idempotencyKey?: string;
  ipAddress?: string;
  country?: string;
}): { score: number; flagged: boolean; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  // 1. Transaction volume limits
  if (payload.amountRupees && payload.amountRupees > 10000) {
    score += 45;
    reasons.push("High transaction value (> \u20B910,000)");
  }

  // 2. High-value wallet risk
  if (payload.paymentMethod === "wallet" && payload.amountRupees && payload.amountRupees > 2000) {
    score += 25;
    reasons.push("High value wallet payment (> \u20B92,000)");
  }

  // 3. Location mismatch / geo-risk
  if (payload.country && payload.country !== "IN") {
    score += 30;
    reasons.push(`International transaction location: ${payload.country}`);
  }

  // 4. Malformed transaction inputs (potential SQL injection or API tampering)
  if (payload.idempotencyKey && !/^[a-zA-Z0-9_-]+$/.test(payload.idempotencyKey)) {
    score += 60;
    reasons.push("Suspicious characters in idempotency key (possible tamper attempt)");
  }

  return {
    score,
    flagged: score >= 50,
    reasons,
  };
}
