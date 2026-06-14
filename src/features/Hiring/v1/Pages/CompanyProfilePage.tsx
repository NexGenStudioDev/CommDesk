import React, { useState, useEffect } from "react";
import { useTheme } from "@/theme";
import { useCompanyProfile, useUpdateCompanyProfile } from "../Hooks/useHiring";
import Input from "@/Component/ui/Input";
import Button from "@/Component/ui/Button";

const CompanyProfilePage = () => {
  const { theme } = useTheme();
  const { data: profile, isLoading } = useCompanyProfile();
  const updateProfileMutation = useUpdateCompanyProfile();

  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [industry, setIndustry] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [github, setGithub] = useState("");
  const [discord, setDiscord] = useState("");
  const [twitter, setTwitter] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setAbout(profile.about || "");
      setTeamSize(profile.teamSize || "");
      setIndustry(profile.industry || "");
      setLogoUrl(profile.logoUrl || "");
      setBannerUrl(profile.bannerUrl || "");
      setGithub(profile.socialLinks?.github || "");
      setDiscord(profile.socialLinks?.discord || "");
      setTwitter(profile.socialLinks?.twitter || "");
      setLinkedin(profile.socialLinks?.linkedin || "");
      setSeoTitle(profile.seoTitle || "");
      setSeoDescription(profile.seoDescription || "");
    }
  }, [profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");

    updateProfileMutation.mutate(
      {
        name,
        about,
        teamSize,
        industry,
        logoUrl,
        bannerUrl,
        socialLinks: { github, discord, twitter, linkedin },
        seoTitle,
        seoDescription,
      },
      {
        onSuccess: () => {
          setSuccessMsg("Company profile updated successfully!");
          setTimeout(() => setSuccessMsg(""), 3000);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-sm font-medium animate-pulse" style={{ color: theme.text.secondary }}>
          Loading profile settings...
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-10" style={{ backgroundColor: theme.bg.page }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col gap-1 mb-8">
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: theme.text.primary }}>
            Company Profile Management
          </h1>
          <p className="text-sm" style={{ color: theme.text.secondary }}>
            Configure your organization branding, career portal styling, and social media integration.
          </p>
        </div>

        {successMsg && (
          <div
            className="mb-6 p-4 rounded-lg text-sm font-medium border"
            style={{
              backgroundColor: theme.success.subtle,
              borderColor: theme.success.default,
              color: theme.success.default,
            }}
          >
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {/* Branding Card */}
          <div
            className="rounded-xl border p-6 flex flex-col gap-6"
            style={{ backgroundColor: theme.bg.surface, borderColor: theme.border.default }}
          >
            <h2 className="text-lg font-semibold" style={{ color: theme.text.primary }}>
              Branding Assets
            </h2>

            {/* Banner Preview */}
            <div className="relative h-40 rounded-lg overflow-hidden border bg-zinc-900" style={{ borderColor: theme.border.default }}>
              <img src={bannerUrl || "/defaultBanner.jpg"} alt="Banner Preview" className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              {/* Logo Preview */}
              <div className="absolute bottom-4 left-4 flex items-center gap-3">
                <div
                  className="w-16 h-16 rounded-xl border-2 overflow-hidden bg-white shadow-md flex items-center justify-center p-2"
                  style={{ borderColor: theme.border.default }}
                >
                  <img src={logoUrl || "/logoWithoutText.png"} alt="Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg leading-tight shadow-sm">{name || "Company Name"}</h3>
                  <span className="text-white/80 text-xs font-semibold uppercase tracking-wider">{industry || "Industry"}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Company Name"
                name="name"
                value={name}
                onChange={(_, val) => setName(val)}
                required
              />
              <Input
                label="Industry Type"
                name="industry"
                value={industry}
                onChange={(_, val) => setIndustry(val)}
                placeholder="e.g. Design & Tech"
                required
              />
              <Input
                label="Logo Image URL"
                name="logoUrl"
                value={logoUrl}
                onChange={(_, val) => setLogoUrl(val)}
                placeholder="/logoWithoutText.png"
              />
              <Input
                label="Banner Image URL"
                name="bannerUrl"
                value={bannerUrl}
                onChange={(_, val) => setBannerUrl(val)}
                placeholder="e.g. Unsplash URL"
              />
            </div>
          </div>

          {/* About Company */}
          <div
            className="rounded-xl border p-6 flex flex-col gap-6"
            style={{ backgroundColor: theme.bg.surface, borderColor: theme.border.default }}
          >
            <h2 className="text-lg font-semibold" style={{ color: theme.text.primary }}>
              Company Details
            </h2>

            <div className="flex flex-col gap-2">
              <label
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: theme.text.secondary }}
              >
                About Company
              </label>
              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                className="w-full h-32 rounded-lg p-3 border outline-none text-sm resize-none focus:ring-2"
                style={{
                  backgroundColor: theme.bg.surface,
                  borderColor: theme.border.default,
                  color: theme.text.primary,
                }}
                placeholder="Write a brief overview of your organization..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Company Size"
                name="teamSize"
                value={teamSize}
                onChange={(_, val) => setTeamSize(val)}
                placeholder="e.g. 50-150 employees"
              />
            </div>
          </div>

          {/* Social Links */}
          <div
            className="rounded-xl border p-6 flex flex-col gap-6"
            style={{ backgroundColor: theme.bg.surface, borderColor: theme.border.default }}
          >
            <h2 className="text-lg font-semibold" style={{ color: theme.text.primary }}>
              Social Integrations
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="GitHub URL"
                name="github"
                value={github}
                onChange={(_, val) => setGithub(val)}
                placeholder="https://github.com/org"
              />
              <Input
                label="LinkedIn Profile"
                name="linkedin"
                value={linkedin}
                onChange={(_, val) => setLinkedin(val)}
                placeholder="https://linkedin.com/company/org"
              />
              <Input
                label="Twitter / X handle"
                name="twitter"
                value={twitter}
                onChange={(_, val) => setTwitter(val)}
                placeholder="https://twitter.com/org"
              />
              <Input
                label="Discord Server"
                name="discord"
                value={discord}
                onChange={(_, val) => setDiscord(val)}
                placeholder="https://discord.gg/invite"
              />
            </div>
          </div>

          {/* SEO & Meta Config */}
          <div
            className="rounded-xl border p-6 flex flex-col gap-6"
            style={{ backgroundColor: theme.bg.surface, borderColor: theme.border.default }}
          >
            <h2 className="text-lg font-semibold" style={{ color: theme.text.primary }}>
              SEO & Accessibility Settings
            </h2>

            <div className="grid grid-cols-1 gap-4">
              <Input
                label="Meta Title Tag"
                name="seoTitle"
                value={seoTitle}
                onChange={(_, val) => setSeoTitle(val)}
                placeholder="Title that shows in browser tab"
              />
              <div className="flex flex-col gap-2">
                <label
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: theme.text.secondary }}
                >
                  Meta Description
                </label>
                <textarea
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  className="w-full h-20 rounded-lg p-3 border outline-none text-sm resize-none"
                  style={{
                    backgroundColor: theme.bg.surface,
                    borderColor: theme.border.default,
                    color: theme.text.primary,
                  }}
                  placeholder="Summary for search engines..."
                />
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-end gap-3 items-center">
            <Button
              text={updateProfileMutation.isPending ? "Saving changes..." : "Save Configuration"}
              onClick={() => {}}
              type="submit"
              disabled={updateProfileMutation.isPending}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyProfilePage;
