import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export const signupSchema = z.object({
  communityName: z.string().min(2, "Community name must be at least 2 characters"),
  communityBio: z.string().min(10, "Bio must be at least 10 characters"),
  communityLogo: z.string().optional(),
  communityWebsite: z.string().url("Must be a valid URL").optional().or(z.literal("")),

  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  officialEmail: z.string().email("Must be a valid email"),
  contactPhone: z.string().min(7, "Phone number is too short"),

  socialLinks: z.object({
    twitter: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    linkedin: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    instagram: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    github: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    facebook: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  }),

  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Must be a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[^a-zA-Z0-9]/, "Must contain at least one special character"),
});

export type SignupFormData = z.infer<typeof signupSchema>;

export const STEP_FIELDS: Record<number, (keyof SignupFormData)[]> = {
  1: ["communityName", "communityBio", "communityWebsite"],
  2: ["country", "city", "officialEmail", "contactPhone"],
  3: ["socialLinks"],
  4: ["fullName", "email", "password"],
  5: [],
};

export function useSignupForm() {
  return useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onTouched",
    defaultValues: {
      communityName: "",
      communityBio: "",
      communityLogo: "",
      communityWebsite: "",
      country: "",
      city: "",
      officialEmail: "",
      contactPhone: "",
      socialLinks: {
        twitter: "",
        linkedin: "",
        instagram: "",
        github: "",
        facebook: "",
      },
      fullName: "",
      email: "",
      password: "",
    },
  });
}
