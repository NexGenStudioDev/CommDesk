export type CommunitySchema = {
  CommunityName: string;
  Bio: string;
  Slug: string;
  Website: string;
  Country: string;
  City: string;
  OfficialEmail: string;
  ContactPhone: string;
  LogoUrl: string;

  SocialLinks: {
    github?: string;
    discord?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
    instagram?: string;
  };
};
