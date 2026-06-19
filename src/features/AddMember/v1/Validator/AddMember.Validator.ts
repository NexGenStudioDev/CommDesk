import z from "zod";

const onboardingSourceEnum = z.enum([
  "website",
  "referral",
  "social_media",
  "event",
  "direct_invitation",
  "other",
]);

const membershipStatusEnum = z.enum(["On Boarding", "Pending", "Active", "Inactive", "Suspended"]);

const optionalUrl = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().url("Invalid URL").optional(),
);

export const MemberValidationSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  imageUrl: optionalUrl,
  publicProfileUrl: optionalUrl,
  email: z.string().email("Invalid email format").toLowerCase().trim(),
  AuthId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid Mongo ObjectId")
    .optional(),
  membershipStatus: membershipStatusEnum.default("On Boarding").optional(),
  onboardingSource: onboardingSourceEnum.default("website").optional(),
  primaryRole: z.string().min(1, "Primary role is required"),
  location: z.string().min(2, "Location is required"),
  skills: z.array(z.string()).optional(),
  areaOfInterest: z.array(z.string()).min(1, "Area of interest is required"),
  internalNotes: z.string().optional(),
});

export type MemberFormValues = z.input<typeof MemberValidationSchema>;
export type MemberSubmitValues = z.output<typeof MemberValidationSchema>;
