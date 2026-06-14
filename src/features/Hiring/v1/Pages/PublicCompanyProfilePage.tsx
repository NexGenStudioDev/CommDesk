import { useTheme } from "@/theme";
import { useNavigate, useParams } from "react-router-dom";
import { useCompanyProfile, useJobs } from "../Hooks/useHiring";
import { FiBriefcase, FiArrowRight } from "react-icons/fi";
import { FaGithub, FaDiscord, FaTwitter, FaLinkedin } from "react-icons/fa";

const PublicCompanyProfilePage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();

  // Fetch data
  const { data: profile, isLoading: profileLoading } = useCompanyProfile();
  const { data: jobs = [], isLoading: jobsLoading } = useJobs({ status: "active" });

  if (profileLoading || jobsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-zinc-50 dark:bg-zinc-950">
        <div className="text-sm font-semibold animate-pulse" style={{ color: theme.text.secondary }}>
          Loading NexGen Careers...
        </div>
      </div>
    );
  }

  if (!profile || profile.slug !== slug) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 gap-4 bg-zinc-50 dark:bg-zinc-950">
        <span className="text-sm font-bold" style={{ color: theme.text.primary }}>Company Profile Not Found</span>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold"
        >
          Return to Portal
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col w-full" style={{ backgroundColor: theme.bg.page }}>
      {/* Public Guest Header */}
      <header
        className="px-6 py-4 border-b flex items-center justify-between"
        style={{ borderColor: theme.border.default, backgroundColor: theme.bg.surface }}
      >
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <img src="/logoWithoutText.png" alt="CommDesk Logo" className="w-7 h-7" />
          <span className="font-bold text-sm" style={{ color: theme.text.primary }}>CommDesk Careers</span>
        </div>
        <span className="text-xs font-bold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer" onClick={() => navigate("/")}>
          Hiring Portal &rarr;
        </span>
      </header>

      {/* Hero Banner Banner */}
      <div className="w-full relative h-64 md:h-80 overflow-hidden bg-zinc-950">
        <img
          src={profile.bannerUrl}
          alt="Company Banner"
          className="w-full h-full object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-white border p-3 flex items-center justify-center shadow-lg">
              <img src={profile.logoUrl} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl md:text-3xl font-black text-white leading-tight shadow-sm">
                {profile.name}
              </h1>
              <span className="text-white/80 text-xs font-bold uppercase tracking-wider mt-0.5">
                {profile.industry} &bull; {profile.teamSize}
              </span>
            </div>
          </div>

          {/* Socials */}
          <div className="flex items-center gap-3 text-white/90">
            {profile.socialLinks?.github && (
              <a href={profile.socialLinks.github} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                <FaGithub className="w-5 h-5" />
              </a>
            )}
            {profile.socialLinks?.discord && (
              <a href={profile.socialLinks.discord} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                <FaDiscord className="w-5 h-5" />
              </a>
            )}
            {profile.socialLinks?.twitter && (
              <a href={profile.socialLinks.twitter} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                <FaTwitter className="w-5 h-5" />
              </a>
            )}
            {profile.socialLinks?.linkedin && (
              <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                <FaLinkedin className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full flex flex-col lg:flex-row gap-10">
        {/* Left Side: About & Perks & Media */}
        <div className="flex-1 flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-black tracking-tight" style={{ color: theme.text.primary }}>
              About {profile.name}
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: theme.text.secondary }}>
              {profile.about}
            </p>
          </div>

          {/* Perks */}
          <div className="flex flex-col gap-4">
            <h3 className="text-base font-black tracking-tight" style={{ color: theme.text.primary }}>
              Benefits & Perks
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {profile.benefits.map((perk, idx) => (
                <div
                  key={idx}
                  className="p-3 border rounded-xl flex items-center gap-2.5 text-xs font-semibold"
                  style={{ borderColor: theme.border.default, backgroundColor: theme.bg.surfaceSecondary }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                  <span style={{ color: theme.text.primary }}>{perk}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Media gallery */}
          <div className="flex flex-col gap-4">
            <h3 className="text-base font-black tracking-tight" style={{ color: theme.text.primary }}>
              Culture & Office Life
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {profile.media.map((url, idx) => (
                <div
                  key={idx}
                  className="h-36 rounded-xl overflow-hidden border bg-zinc-100 dark:bg-zinc-800"
                  style={{ borderColor: theme.border.default }}
                >
                  <img src={url} alt={`Culture gallery ${idx + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Open Jobs */}
        <div className="w-full lg:w-96 flex flex-col gap-6">
          <div
            className="border rounded-xl p-6 shadow-sm flex flex-col gap-5 bg-white dark:bg-zinc-900"
            style={{ borderColor: theme.border.default }}
          >
            <h3 className="text-base font-black tracking-tight flex items-center gap-2" style={{ color: theme.text.primary }}>
              <FiBriefcase className="text-blue-500" /> Open Positions ({jobs.length})
            </h3>

            {jobs.length === 0 ? (
              <p className="text-xs text-center py-6" style={{ color: theme.text.muted }}>
                We are not actively recruiting right now. Check back soon!
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    onClick={() => navigate(`/company/${slug}/jobs/${job.id}`)}
                    className="p-4 border rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-all flex justify-between items-center group"
                    style={{ borderColor: theme.border.default }}
                  >
                    <div className="flex flex-col gap-1 min-w-0 pr-3">
                      <span className="text-xs font-bold truncate group-hover:text-blue-500 transition-colors" style={{ color: theme.text.primary }}>
                        {job.title}
                      </span>
                      <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-semibold">
                        <span>{job.department}</span>
                        <span>&bull;</span>
                        <span className="capitalize">{job.workplaceType}</span>
                      </div>
                    </div>
                    <FiArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PublicCompanyProfilePage;
