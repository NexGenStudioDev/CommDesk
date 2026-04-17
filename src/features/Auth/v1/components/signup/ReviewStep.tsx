import { useFormContext } from "react-hook-form";
import {
  Globe, MapPin, Mail, Phone, Twitter, Linkedin,
  Instagram, Github, Facebook, User, Lock, Image,
} from "lucide-react";
import { SignupFormData } from "../../hooks/useSignupForm";

function ReviewRow({ label, value, icon: Icon }: { label: string; value?: string; icon: React.ElementType }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-gray-100 last:border-0">
      <div className="mt-0.5 p-1.5 bg-indigo-50 rounded-md">
        <Icon className="w-3.5 h-3.5 text-indigo-500" />
      </div>
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">{label}</span>
        <span className="text-sm text-gray-700 inter break-all">{value}</span>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider inter">{title}</h4>
      </div>
      <div className="px-4 divide-y divide-gray-100">{children}</div>
    </div>
  );
}

export default function ReviewStep() {
  const context = useFormContext<SignupFormData>();
  if (!context) return <div className="p-4 text-red-600 bg-red-50 rounded-lg inter text-sm">Error: Form context unavailable.</div>;

  const { watch } = context;
  const data = watch();

  if (!data) return <div className="p-4 text-gray-500 bg-gray-50 rounded-lg inter text-sm">No review data available.</div>;

  const hasSocials = data.socialLinks ? Object.values(data.socialLinks).some(Boolean) : false;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-gray-800 inter tracking-tight">Review & Submit</h2>
        <p className="text-gray-500 text-sm mt-1 inter">
          Almost there! Please verify your community details below.
        </p>
      </div>

      {/* Logo Preview */}
      {data.communityLogo && (
        <div className="flex items-center gap-4 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 backdrop-blur-sm">
          <img
            src={data.communityLogo}
            alt="Community Logo"
            className="w-16 h-16 rounded-2xl object-cover shadow-sm ring-4 ring-white"
          />
          <div>
            <p className="font-bold text-gray-900 inter text-base leading-tight">
              {data.communityName || "New Community"}
            </p>
            <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wider mt-1">
              Ready for activation
            </p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <Section title="Community Details">
          <ReviewRow label="Name" value={data.communityName} icon={Globe} />
          <ReviewRow label="Tagline/Bio" value={data.communityBio} icon={Globe} />
          <ReviewRow label="Website" value={data.communityWebsite} icon={Globe} />
        </Section>

        <Section title="Primary Contact">
          <ReviewRow label="Location" value={data.city && data.country ? `${data.city}, ${data.country}` : undefined} icon={MapPin} />
          <ReviewRow label="Official Email" value={data.officialEmail} icon={Mail} />
          <ReviewRow label="Contact Phone" value={data.phoneCode && data.phoneNumber ? `${data.phoneCode} ${data.phoneNumber}` : undefined} icon={Phone} />
        </Section>

        {hasSocials && (
          <Section title="Web Presence">
            <ReviewRow label="Twitter" value={data.socialLinks?.twitter} icon={Twitter} />
            <ReviewRow label="LinkedIn" value={data.socialLinks?.linkedin} icon={Linkedin} />
            <ReviewRow label="Instagram" value={data.socialLinks?.instagram} icon={Instagram} />
            <ReviewRow label="GitHub" value={data.socialLinks?.github} icon={Github} />
            <ReviewRow label="Facebook" value={data.socialLinks?.facebook} icon={Facebook} />
          </Section>
        )}

        <Section title="Administrator">
          <ReviewRow label="Name" value={`${data.firstName} ${data.lastName}`} icon={User} />
          <ReviewRow label="Email" value={data.email} icon={Mail} />
          <ReviewRow label="Security" value="••••••••" icon={Lock} />
        </Section>
      </div>

      <p className="text-[10px] text-gray-400 inter text-center pt-2 px-6">
        By submitting, you confirm that all information provided is accurate and you agree to our Terms of Use.
      </p>
    </div>
  );
}
