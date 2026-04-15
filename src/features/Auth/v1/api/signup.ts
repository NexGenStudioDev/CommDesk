import { SignupFormData } from "../hooks/useSignupForm";

export type SignupResponse = {
  message: string;
  communityId?: string;
};

/**
 * Submits the final community signup form.
 */
export async function submitCommunitySignup(data: SignupFormData): Promise<SignupResponse> {
  const res = await fetch("/api/v1/auth/signup-community", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data), // Using spread/data directly as schema matches backend requirements
  });

  const json = await res.json();

  if (!res.ok) {
    throw { status: res.status, data: json };
  }

  return json as SignupResponse;
}

/**
 * Handles logo upload. Currently simulated with FileReader.
 * In production: Replace with real FormData upload to S3/Cloudinary.
 */
export async function uploadCommunityLogo(file: File): Promise<string> {
  // SIMULATION: If you need to switch to a real API, change this implementation
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
}
