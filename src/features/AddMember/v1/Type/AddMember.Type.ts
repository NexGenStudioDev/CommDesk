type onBoardingSourceType =
  | "website"
  | "referral"
  | "social_media"
  | "event"
  | "direct_invitation"
  | "other";

type memberStatusType = "On Boarding" | "Pending" | "Active" | "Inactive" | "Suspended" | "Banned";

export type MemberType = {
  firstName: string;
  lastName: string;
  imageUrl?: string;
  publicProfileUrl?: string;

  email: string;
  membershipStatus?: memberStatusType;
  onboardingSource?: onBoardingSourceType;
  primaryRole?: string;
  location?: string;
  skills?: string[];
  areaOfInterest?: string[];
  internalNotes?: string;
};
