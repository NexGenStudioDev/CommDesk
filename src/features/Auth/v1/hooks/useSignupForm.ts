import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export const signupSchema = z.object({
  communityName: z.string().min(2, "Community name must be at least 2 characters"),
  communityBio: z.string().min(10, "Bio must be at least 10 characters"),
  communityLogo: z.string().optional(),
  communityWebsite: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((val) => !val || /^(?!https?:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/.test(val), {
      message: "Enter domain only (e.g. example.com). Do not include http:// or https://",
    })
    .transform((val) => (val && val.trim() !== "" ? `https://${val}` : val)),

  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  officialEmail: z.string().email("Must be a valid email"),
  phoneCode: z.string().min(1, "Code required"),
  phoneNumber: z.string().min(7, "Phone number is too short").regex(/^\d+$/, "Numeric only"),

  socialLinks: z.object({
    twitter: z.string().optional().or(z.literal("")).refine((v) => !v || (v.startsWith("https://") && z.string().url().safeParse(v).success), {
      message: "Must be a valid URL starting with https://",
    }),
    linkedin: z.string().optional().or(z.literal("")).refine((v) => !v || (v.startsWith("https://") && z.string().url().safeParse(v).success), {
      message: "Must be a valid URL starting with https://",
    }),
    instagram: z.string().optional().or(z.literal("")).refine((v) => !v || (v.startsWith("https://") && z.string().url().safeParse(v).success), {
      message: "Must be a valid URL starting with https://",
    }),
    github: z.string().optional().or(z.literal("")).refine((v) => !v || (v.startsWith("https://") && z.string().url().safeParse(v).success), {
      message: "Must be a valid URL starting with https://",
    }),
    facebook: z.string().optional().or(z.literal("")).refine((v) => !v || (v.startsWith("https://") && z.string().url().safeParse(v).success), {
      message: "Must be a valid URL starting with https://",
    }),
  }),

  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Must be a valid email"),
  location: z.string().min(1, "Location is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[^a-zA-Z0-9]/, "Must contain at least one special character"),
  confirmPassword: z.string(),
  primaryRole: z.string().default("ORGANISER"),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  areaOfInterest: z.array(z.string()).min(1, "Select at least one area of interest"),
  internalNotes: z.string().optional(),
  permissions: z.object({
    internalDashboard: z.boolean().default(false),
    communityForum: z.boolean().default(false),
    adminControls: z.boolean().default(false),
    superAdmin: z.boolean().default(false),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type SignupFormData = z.infer<typeof signupSchema>;

export const STEP_FIELDS: Record<number, (keyof SignupFormData)[]> = {
  1: ["communityName", "communityBio", "communityWebsite"],
  2: ["country", "city", "officialEmail", "phoneCode", "phoneNumber"],
  3: ["socialLinks"],
  4: [
    "firstName",
    "lastName",
    "email",
    "location",
    "password",
    "confirmPassword",
    "primaryRole",
    "skills",
    "areaOfInterest",
    "internalNotes",
    "permissions",
  ],
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
      phoneCode: "+1",
      phoneNumber: "",
      socialLinks: {
        twitter: "",
        linkedin: "",
        instagram: "",
        github: "",
        facebook: "",
      },
      firstName: "",
      lastName: "",
      email: "",
      location: "",
      password: "",
      confirmPassword: "",
      primaryRole: "ORGANISER",
      skills: [],
      areaOfInterest: [],
      internalNotes: "",
      permissions: {
        internalDashboard: false,
        communityForum: false,
        adminControls: false,
        superAdmin: false,
      },
    },
  });
}
